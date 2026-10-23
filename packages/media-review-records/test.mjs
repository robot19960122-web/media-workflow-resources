import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { evaluateReview } from './review.mjs';
import { createTemplate, workflows } from './templates.mjs';
const req = {id:'playback',scope:'full-export',artifactVersion:'v3'};
const observation = {requirementId:'playback',scope:'full-export',artifactVersion:'v3',observed:true,outcome:'pass'};
const doc = (obs=[observation]) => ({schemaVersion:1,requirements:[{...req}],observations:obs});
const cli = (...args) => spawnSync(process.execPath,[fileURLToPath(new URL('./cli.mjs',import.meta.url)),...args],{encoding:'utf8',timeout:5000});
function check(input) {return spawnSync(process.execPath,[fileURLToPath(new URL('./cli.mjs',import.meta.url)),'check','-'],{input:typeof input==='string'?input:JSON.stringify(input),encoding:'utf8',timeout:5000});}
test('matching supplied pass is complete',()=>assert.equal(evaluateReview(doc()).complete,true));
for(const [patch,expected] of [[{outcome:'fail'},'fail'],[{observed:false},'untested'],[{artifactVersion:'v2'},'stale'],[{scope:'preview'},'insufficient'],[{outcome:'unknown'},'unknown']]) {
  test(`record outcome ${expected}`,()=>{const r=evaluateReview(doc([{...observation,...patch}]));assert.equal(r.results[0].status,expected);assert.equal(r.complete,false);});
}
test('missing outcome remains unknown',()=>{const o={...observation};delete o.outcome;assert.equal(evaluateReview(doc([o])).results[0].status,'unknown');});
test('missing observation and optional observations remain untested',()=>{const d=doc([]);assert.equal(evaluateReview(d).counts.untested,1);delete d.observations;assert.equal(evaluateReview(d).counts.untested,1);});
test('stale precedes wrong scope',()=>assert.equal(evaluateReview(doc([{...observation,scope:'preview',artifactVersion:'v1'}])).counts.stale,1));
test('does not mutate inputs',()=>{const d=doc();const original=structuredClone(d);evaluateReview(d);assert.deepEqual(d,original);});
test('no implicit latest observation selection',()=>assert.throws(()=>evaluateReview(doc([observation,{...observation,outcome:'fail'}])),TypeError));
test('unknown reference rejected',()=>assert.throws(()=>evaluateReview(doc([{...observation,requirementId:'other'}])),TypeError));
test('duplicate requirements rejected',()=>{const d=doc();d.requirements.push({...req});assert.throws(()=>evaluateReview(d),TypeError);});
for (const bad of [null, [], {}, {schemaVersion:2,requirements:[req]}, {schemaVersion:1,requirements:[]}, {schemaVersion:1,requirements:[req],observations:null}, {schemaVersion:1,requirements:Array(2001).fill(req)}]) {
  test(`invalid document ${JSON.stringify(bad)?.slice(0,65)}`,()=>assert.throws(()=>evaluateReview(bad),TypeError));
}
for(const patch of [{observed:'true'},{outcome:'likely'},{outcome:null},{artifactVersion:''},{scope:' '},{requirementId:'https://private.invalid/key'}]) {
  test(`reject malformed observation ${Object.keys(patch)[0]}`,()=>assert.throws(()=>evaluateReview(doc([{...observation,...patch}])),TypeError));
}
test('unknown fields and prototype-like ID cannot corrupt counts',()=>{assert.throws(()=>evaluateReview({...doc(),url:'secret'}),TypeError);assert.throws(()=>evaluateReview({...doc(),requirements:[{...req,note:'secret'}]}),TypeError);const d={schemaVersion:1,requirements:[{...req,id:'constructor'}],observations:[]};assert.equal(evaluateReview(d).counts.untested,1);});
test('oversized text rejected',()=>assert.throws(()=>evaluateReview({...doc(),requirements:[{...req,scope:'x'.repeat(201)}]}),TypeError));
for(const w of workflows) test(`template ${w} is valid and untested`,()=>{const d=createTemplate(w,'v3');const r=evaluateReview(d);assert.equal(r.complete,false);assert.equal(r.counts.untested,d.requirements.length);d.requirements[0].scope='changed';assert.notEqual(createTemplate(w,'v3').requirements[0].scope,'changed');});
test('unsupported template/version rejected',()=>{assert.throws(()=>createTemplate('constructor','v1'));assert.throws(()=>createTemplate('music',' '));});
test('CLI help has truthful limits',()=>{const r=cli('--help');assert.equal(r.status,0);assert.match(r.stdout,/does not inspect media/);});
test('CLI template returns JSON',()=>{const r=cli('template','music','v3');assert.equal(r.status,0);assert.equal(JSON.parse(r.stdout).workflow,'music');});
test('CLI exit 0/1 match complete/incomplete records',()=>{assert.equal(check(doc()).status,0);assert.equal(check(doc([])).status,1);assert.equal(check(doc([{...observation,outcome:'fail'}])).status,1);});
test('CLI invalid input is 2 and does not leak excerpts',()=>{const r=check('{"privateSecret":"DO_NOT_ECHO"');assert.equal(r.status,2);assert.equal(r.stdout,'');assert.doesNotMatch(r.stderr,/DO_NOT_ECHO|privateSecret/);});
test('CLI input cap',()=>{const r=check(' '.repeat(1024*1024+1));assert.equal(r.status,2);});
test('CLI unreadable file and unexpected args fail',()=>{assert.equal(cli('check','/definitely-missing-review-file').status,2);assert.equal(cli('template','music').status,2);assert.equal(cli('template','music','v1','extra').status,2);});
