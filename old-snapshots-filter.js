#!/usr/bin/env node
const moment = require(`moment`);
const fs = require('fs');

function parseDir(dirName) {
	const now = Date.now();
	const result = { name: dirName, matched: false };
	const matched = dirName.match(/^(?<y>\d\d\d\d)-(?<m>\d\d)-(?<d>\d\d)-(?<h>\d\d)(?<i>\d\d)\.ro$/); // Match dir names matching format: "yyyy-mm-dd-HHii.ro"
	if (matched) {
		result.matched = true;
		const g = matched.groups;
		time = Date.parse(`${g.y}-${g.m}-${g.d}T${g.h}:${g.i}:00`);
		result.date = new Date(time);
		result.moment = moment(result.date);
		result.age = now - time;
	}
	return result;
}

const dirs = fs.readdirSync('.', { withFileTypes: true }) // search in the working ("current") directory
	.filter(dir => dir.isDirectory()) // match only directories (not files)
	.map(dir => dir.name)
	.sort()
	.map(dirName => parseDir(dirName))
	.filter(dir => dir.matched)
	;

let prev = null;
for (dir of dirs) {
	let keep = false;
	const yearChanged = prev?.date.getFullYear() != dir.date.getFullYear();
	const monthChanged = yearChanged || ( prev?.date.getMonth() != dir.date.getMonth() );
	const dayChanged = yearChanged || monthChanged || ( prev?.date.getDay() != dir.date.getDay() )
	const weekChanged = yearChanged || ( prev?.moment.isoWeek() != dir.moment.isoWeek() );
	keep ||= (dir.age < 10 * 24 * 3600 * 1000); // keep all backups in the last 10 days
	keep ||= monthChanged; // keep the first backup in month
	keep ||= (dir.age < 400 * 24 * 3600 * 1000) && weekChanged; // keep the first backup in week if it's from the last 400 days (Monday is the first day of a week)
	keep ||= (dir.age < 40 * 24 * 3600 * 1000) && dayChanged; // keep the first backup in day if it's from the last 40 days
	console.log(`${keep ? '*' : ' '} ${dir.name}`);
	prev = dir;
}
