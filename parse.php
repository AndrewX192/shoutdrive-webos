<?php

$file = file_get_contents('http://www.shoutdrive.com/pad/paddata_site.php');

$doc = new DOMDocument();
$doc->loadHTML($file);
$anchors = $doc->getElementsByTagName('a');
foreach ($anchors as $anchor) {
    $currentSong = $anchor->nodeValue;
}
$images = $doc->getElementsByTagName('img');
foreach ($images as $image) {
    $artwork = $image->getAttribute('src');
    if ($artwork == 'http://www.shoutdrive.com/hosted_artwork/000000.png') {
        $artwork = 'false';
    }
}

$recent = file_get_contents('http://www.shoutdrive.com/tunage/do.php');
$doc = new DOMDocument();
$doc->loadHTML($recent);
$tunage = $doc->getElementsByTagName('div');

$i = 0;
$songs = array();
foreach ($tunage as $song) {
    foreach ($song->getElementsByTagName('span') as $songPart) {
        switch ($songPart->getAttribute('class')) {
            case 'tuneagedate':
                $songs[$i]['time'] = $songPart->nodeValue;
                break;
            case 'tunageartist':
                $songs[$i]['artist'] = $songPart->nodeValue;
                break;
            case 'tunagetitle':
                $songs[$i]['title'] = $songPart->nodeValue;
        }
    }
    $i++;
}
//
$response = array(
    'currentSong'    => $currentSong,
    'artwork'        => $artwork,
    'recentlyPlayed' => $songs,
);

$fp = fopen('/home/localcoa/public_html/sd/shoutdrive.json', 'w');
fwrite($fp, json_encode($response));
fclose($fp);