#!/usr/bin/env php
<?php
$allDirNames = glob('????-??-??*.ro');
$dirNames = array_filter($allDirNames, 'is_dir');
sort($dirNames);

$last = {}
foreach($dirNames as $dirName) {
	echo "$dirName\n";


	break;
}
