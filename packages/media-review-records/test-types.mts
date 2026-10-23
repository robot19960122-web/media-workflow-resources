import { evaluateReview, outcomeFor, type ReviewDocument } from './review.mjs';
const document: ReviewDocument = {schemaVersion:1, requirements:[{id:'qa',scope:'full',artifactVersion:'v1'}]};
const report = evaluateReview(document);
const complete: boolean = report.complete;
outcomeFor({scope:'full',artifactVersion:'v1'}, null);
// @ts-expect-error Observed must be an explicit boolean.
evaluateReview({schemaVersion:1,requirements:[],observations:[{requirementId:'qa',scope:'full',artifactVersion:'v1',observed:'true'}]});
// @ts-expect-error Only schema version 1 is supported.
evaluateReview({schemaVersion:2,requirements:[]});
console.log(complete);
