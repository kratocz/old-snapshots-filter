#!/usr/bin/env bash
set -e

last_y=null
last_m=null
last_ym=null
last_d=null
last_ymd=null
for file in ????-??-??-????.ro
do
	echo $file
	y=${file:0:4}
	m=${file:5:2}
	ym=$y-$m
	d=${file:8:2}
	ymd=$y-$m-$d
	if [[ $y = '????' ]]
	then
		echo "No matching directory found" 1>&2
		exit 1
	fi
	#echo "ymd: $ymd"
	age_d=$(( ( `date +%s` - `date +%s -d $ymd` ) / 24 / 3600 ))
	#echo "age_d: $age_d"
	del=1 # Delete it by default
	if [[ $last_ym ]]
	then
	fi
	break
	last_y=$y
	last_m=$m
	last_d=$d
done
