<?php
declare(strict_types=1);

/**
 * Live photo list for FTP-only hosting.
 *
 *   photos.php?list=1          JSON list of the images in photos/
 *   photos.php?thumb=NAME      cached JPEG thumbnail, max 720 px
 *   photos.php?view=NAME       the original image, HEIC converted to JPEG when possible
 *
 * The browser tries this file first and falls back to photos.json when PHP is
 * unavailable. Nothing outside photos/ is ever served, and only image
 * extensions are accepted. iPhone HEIC files are listed too; when Imagick can
 * read them they are converted to JPEG once and cached in photos/converted/,
 * and otherwise the browser converts them itself (see assets/js/app.js).
 */

const PHOTO_DIR = __DIR__ . '/photos';
const CACHE_DIR = PHOTO_DIR . '/.cache';
const CONVERTED_DIR = PHOTO_DIR . '/converted';
const CAPTIONS_FILE = PHOTO_DIR . '/captions.json';
const CONVERT_MAX = 2600;
const CONVERT_QUALITY = 88;
const THUMB_MAX = 720;
const THUMB_QUALITY = 82;

const IMAGE_TYPES = [
    'jpg'  => 'image/jpeg',
    'jpeg' => 'image/jpeg',
    'png'  => 'image/png',
    'webp' => 'image/webp',
    'gif'  => 'image/gif',
    'avif' => 'image/avif',
    'heic' => 'image/heic',
    'heif' => 'image/heic'
];

const HEIC_TYPES = ['heic', 'heif'];

header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: same-origin');

$action = isset($_GET['list']) ? (string) $_GET['list'] : '';
if ($action === '1') {
    sendPhotoList();
}

if (isset($_GET['thumb'])) {
    sendThumbnail((string) $_GET['thumb']);
}

if (isset($_GET['view'])) {
    sendOriginal((string) $_GET['view']);
}

jsonResponse(['error' => 'Unknown request.'], 400);

function jsonResponse(array $payload, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function extensionOf(string $name): string
{
    return strtolower((string) pathinfo($name, PATHINFO_EXTENSION));
}

function safePhotoName(string $raw): ?string
{
    $name = basename($raw);

    if ($name === '' || $name === '.' || $name === '..' || $name[0] === '.') {
        return null;
    }

    if (!isset(IMAGE_TYPES[extensionOf($name)])) {
        return null;
    }

    return $name;
}

function photoPath(string $name): ?string
{
    $name = safePhotoName($name);
    if ($name === null) {
        return null;
    }

    $path = PHOTO_DIR . '/' . $name;
    if (!is_file($path)) {
        return null;
    }

    $real = realpath($path);
    $root = realpath(PHOTO_DIR);

    if ($real === false || $root === false) {
        return null;
    }

    if (strpos($real, $root . DIRECTORY_SEPARATOR) !== 0) {
        return null;
    }

    return $real;
}

function listPhotoNames(): array
{
    if (!is_dir(PHOTO_DIR)) {
        return [];
    }

    $names = [];
    $entries = scandir(PHOTO_DIR);

    if ($entries === false) {
        return [];
    }

    foreach ($entries as $entry) {
        if ($entry === '.' || $entry === '..' || $entry[0] === '.') {
            continue;
        }

        $path = PHOTO_DIR . '/' . $entry;
        if (is_file($path) && isset(IMAGE_TYPES[extensionOf($entry)])) {
            $names[] = $entry;
        }
    }

    natcasesort($names);
    return array_values($names);
}

function slugify(string $value): string
{
    $value = strtr($value, [
        'ä' => 'ae', 'ö' => 'oe', 'ü' => 'ue', 'ß' => 'ss',
        'Ä' => 'Ae', 'Ö' => 'Oe', 'Ü' => 'Ue'
    ]);

    $converted = @iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $value);
    if ($converted !== false) {
        $value = $converted;
    }

    $value = strtolower($value);
    $value = preg_replace('/[^a-z0-9]+/', '-', $value) ?? '';
    $value = trim($value, '-');

    return substr($value, 0, 80);
}

function loadCaptions(): array
{
    if (!is_file(CAPTIONS_FILE)) {
        return [];
    }

    $raw = @file_get_contents(CAPTIONS_FILE);
    if ($raw === false) {
        return [];
    }

    $parsed = json_decode($raw, true);
    return is_array($parsed) ? $parsed : [];
}

function captionFor(array $captions, string $filename): array
{
    $entry = $captions[$filename] ?? null;

    if (is_string($entry)) {
        return ['caption' => trim($entry), 'alt' => ''];
    }

    if (is_array($entry)) {
        $caption = isset($entry['caption']) && is_string($entry['caption']) ? trim($entry['caption']) : '';
        $alt = isset($entry['alt']) && is_string($entry['alt']) ? trim($entry['alt']) : '';
        return ['caption' => $caption, 'alt' => $alt];
    }

    return ['caption' => '', 'alt' => ''];
}

function sendPhotoList(): void
{
    $captions = loadCaptions();
    $photos = [];
    $used = [];

    foreach (listPhotoNames() as $filename) {
        $base = pathinfo($filename, PATHINFO_FILENAME);
        $id = slugify($base);
        if ($id === '') {
            $id = 'photo';
        }

        $unique = $id;
        $attempt = 2;
        while (isset($used[$unique])) {
            $unique = $id . '-' . $attempt;
            $attempt++;
        }
        $used[$unique] = true;

        $path = PHOTO_DIR . '/' . $filename;
        $extension = extensionOf($filename);
        $isHeic = in_array($extension, HEIC_TYPES, true);

        // HEIC goes through this script: it serves a converted JPEG when there
        // is one, and the original otherwise. Direct links would only work in
        // Safari.
        $src = $isHeic
            ? 'photos.php?view=' . rawurlencode($filename)
            : 'photos/' . rawurlencode($filename);

        $size = @getimagesize($path);
        $width = $size !== false ? (int) $size[0] : 1200;
        $height = $size !== false ? (int) $size[1] : 1200;

        $converted = $isHeic ? convertedName($filename) : '';
        if ($converted !== '' && is_file(CONVERTED_DIR . '/' . $converted)) {
            $width = 0;
            $height = 0;
            $info = @getimagesize(CONVERTED_DIR . '/' . $converted);
            if ($info !== false) {
                $width = (int) $info[0];
                $height = (int) $info[1];
            }
        }

        $meta = captionFor($captions, $filename);

        $photos[] = [
            'id' => $unique,
            'src' => $src,
            'thumb' => 'photos.php?thumb=' . rawurlencode($filename),
            'view' => 'photos.php?view=' . rawurlencode($filename),
            'filename' => $filename,
            'caption' => $meta['caption'],
            'alt' => $meta['alt'],
            'demo' => false,
            'heic' => $isHeic,
            'width' => $width,
            'height' => $height
        ];
    }

    jsonResponse([
        'generated' => date('c'),
        'source' => 'photos',
        'photos' => $photos
    ]);
}

function sendOriginal(string $rawName): void
{
    $path = photoPath($rawName);
    if ($path === null) {
        http_response_code(404);
        exit;
    }

    if (in_array(extensionOf($path), HEIC_TYPES, true)) {
        $jpeg = convertedJpeg($path);

        // No converter and no cached copy: send the original. Safari can draw
        // it; other browsers trigger the in-browser conversion in app.js.
        if ($jpeg !== null) {
            serveFile($jpeg, 'image/jpeg', 604800);
        }
    }

    serveFile($path, IMAGE_TYPES[extensionOf($path)] ?? 'application/octet-stream', 604800);
}

function sendThumbnail(string $rawName): void
{
    $path = photoPath($rawName);
    if ($path === null) {
        http_response_code(404);
        exit;
    }

    if (in_array(extensionOf($path), HEIC_TYPES, true)) {
        $jpeg = convertedJpeg($path);
        if ($jpeg !== null) {
            $path = $jpeg;
        }
    }

    $name = basename($path);
    $mime = IMAGE_TYPES[extensionOf($path)] ?? '';

    if (!is_dir(CACHE_DIR)) {
        @mkdir(CACHE_DIR, 0775, true);
    }

    $cacheFile = CACHE_DIR . '/' . md5($name . '|' . filemtime($path) . '|' . filesize($path)) . '.jpg';

    if (is_file($cacheFile)) {
        serveFile($cacheFile, 'image/jpeg', 604800);
    }

    if (!extension_loaded('gd') || !is_writable(dirname($cacheFile))) {
        serveFile($path, $mime, 86400);
    }

    $thumb = makeThumbnail($path);

    if ($thumb === null) {
        serveFile($path, $mime, 86400);
    }

    if (@imagejpeg($thumb, $cacheFile, THUMB_QUALITY)) {
        imagedestroy($thumb);
        serveFile($cacheFile, 'image/jpeg', 604800);
    }

    imagedestroy($thumb);
    serveFile($path, $mime, 86400);
}

function convertedName(string $path): string
{
    return pathinfo($path, PATHINFO_FILENAME) . '.jpg';
}

/**
 * Absolute path to a JPEG version of a HEIC file, or null when neither a
 * previously converted copy nor Imagick is available. Imagick is the only
 * decoder that can realistically be installed on shared hosting.
 */
function convertedJpeg(string $path): ?string
{
    $target = CONVERTED_DIR . '/' . convertedName($path);

    if (is_file($target) && filemtime($target) >= filemtime($path)) {
        return $target;
    }

    if (!extension_loaded('imagick') || !class_exists('Imagick')) {
        return null;
    }

    if (!is_dir(CONVERTED_DIR)) {
        @mkdir(CONVERTED_DIR, 0775, true);
    }

    if (!is_dir(CONVERTED_DIR) || !is_writable(CONVERTED_DIR)) {
        return null;
    }

    try {
        $image = new Imagick($path);
        $image->setImageFormat('jpeg');
        $image->setImageCompressionQuality(CONVERT_QUALITY);
        $image->setBackgroundColor('white');

        if ($image->getImageWidth() > CONVERT_MAX || $image->getImageHeight() > CONVERT_MAX) {
            $image->thumbnailImage(CONVERT_MAX, CONVERT_MAX, true);
        }

        $written = $image->writeImage($target);
        $image->clear();
    } catch (Throwable $error) {
        return null;
    }

    return $written && is_file($target) ? $target : null;
}

function makeThumbnail(string $path)
{
    $size = @getimagesize($path);
    if ($size === false) {
        return null;
    }

    $source = createImage($path);
    if ($source === null) {
        return null;
    }

    $source = applyExifOrientation($source, $path);

    $width = imagesx($source);
    $height = imagesy($source);

    if ($width < 1 || $height < 1) {
        imagedestroy($source);
        return null;
    }

    $scale = min(1, THUMB_MAX / max($width, $height));
    $targetWidth = max(1, (int) round($width * $scale));
    $targetHeight = max(1, (int) round($height * $scale));

    $target = imagecreatetruecolor($targetWidth, $targetHeight);
    if ($target === false) {
        imagedestroy($source);
        return null;
    }

    $paper = imagecolorallocate($target, 246, 239, 223);
    imagefilledrectangle($target, 0, 0, $targetWidth, $targetHeight, $paper);
    imagecopyresampled($target, $source, 0, 0, 0, 0, $targetWidth, $targetHeight, $width, $height);
    imagedestroy($source);

    return $target;
}

function createImage(string $path)
{
    $extension = extensionOf($path);

    $created = null;
    switch ($extension) {
        case 'jpg':
        case 'jpeg':
            if (function_exists('imagecreatefromjpeg')) {
                $created = @imagecreatefromjpeg($path);
            }
            break;
        case 'png':
            if (function_exists('imagecreatefrompng')) {
                $created = @imagecreatefrompng($path);
            }
            break;
        case 'webp':
            if (function_exists('imagecreatefromwebp')) {
                $created = @imagecreatefromwebp($path);
            }
            break;
        case 'gif':
            if (function_exists('imagecreatefromgif')) {
                $created = @imagecreatefromgif($path);
            }
            break;
        case 'avif':
            if (function_exists('imagecreatefromavif')) {
                $created = @imagecreatefromavif($path);
            }
            break;
    }

    return $created === false ? null : $created;
}

function applyExifOrientation($image, string $path)
{
    if (!function_exists('exif_read_data')) {
        return $image;
    }

    $exif = @exif_read_data($path);
    $orientation = isset($exif['Orientation']) ? (int) $exif['Orientation'] : 1;

    switch ($orientation) {
        case 2:
            imageflip($image, IMG_FLIP_HORIZONTAL);
            break;
        case 3:
            $image = imagerotate($image, 180, 0);
            break;
        case 4:
            imageflip($image, IMG_FLIP_VERTICAL);
            break;
        case 5:
            $image = imagerotate($image, -90, 0);
            imageflip($image, IMG_FLIP_HORIZONTAL);
            break;
        case 6:
            $image = imagerotate($image, -90, 0);
            break;
        case 7:
            $image = imagerotate($image, 90, 0);
            imageflip($image, IMG_FLIP_HORIZONTAL);
            break;
        case 8:
            $image = imagerotate($image, 90, 0);
            break;
    }

    return $image;
}

function serveFile(string $path, string $mime, int $maxAge): void
{
    $mtime = filemtime($path) ?: time();
    $size = filesize($path) ?: 0;
    $etag = '"' . md5($path . '|' . $mtime . '|' . $size) . '"';

    header('ETag: ' . $etag);
    header('Cache-Control: public, max-age=' . $maxAge);

    $ifNoneMatch = $_SERVER['HTTP_IF_NONE_MATCH'] ?? '';
    if ($ifNoneMatch === $etag) {
        http_response_code(304);
        exit;
    }

    header('Content-Type: ' . $mime);
    header('Content-Length: ' . $size);
    header('Last-Modified: ' . gmdate('D, d M Y H:i:s', $mtime) . ' GMT');

    readfile($path);
    exit;
}
