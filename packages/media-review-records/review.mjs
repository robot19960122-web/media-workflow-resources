// User-entered records, not media analysis or factual verification.
export function outcomeFor(requirement, observation) {
  if (!requirement || typeof requirement.scope !== 'string' || !requirement.scope.trim() ||
      typeof requirement.artifactVersion !== 'string' || !requirement.artifactVersion.trim()) {
    throw new TypeError('A nonempty scope and artifactVersion are required');
  }
  if (!observation || observation.observed !== true) return 'untested';
  if (observation.artifactVersion !== requirement.artifactVersion) return 'stale';
  if (observation.scope !== requirement.scope) return 'insufficient';
  if (observation.outcome === 'pass' || observation.outcome === 'fail') return observation.outcome;
  return 'unknown';
}

function object(value, allowed) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new TypeError('Expected a record object');
  if (Object.keys(value).some(key => !allowed.includes(key))) throw new TypeError('Unexpected record field');
}
function text(value) {
  if (typeof value !== 'string' || !value.trim() || value.length > 200) throw new TypeError('Expected nonempty text up to 200 characters');
}
function id(value) {
  if (typeof value !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9._-]{0,99}$/.test(value)) throw new TypeError('Expected a short record ID');
}

/** Validate first, then evaluate exactly one explicitly assigned observation per requirement. */
export function evaluateReview(document) {
  object(document, ['schemaVersion', 'workflow', 'requirements', 'observations']);
  if (document.schemaVersion !== 1) throw new TypeError('Expected schemaVersion 1');
  if (document.workflow !== undefined) text(document.workflow);
  if (!Array.isArray(document.requirements) || document.requirements.length < 1 || document.requirements.length > 2000) {
    throw new TypeError('Expected 1 to 2000 requirements');
  }
  const observations = document.observations === undefined ? [] : document.observations;
  if (!Array.isArray(observations) || observations.length > 2000) throw new TypeError('Expected at most 2000 observations');
  const requirements = new Map();
  for (const requirement of document.requirements) {
    object(requirement, ['id', 'scope', 'artifactVersion']);
    id(requirement.id); text(requirement.scope); text(requirement.artifactVersion);
    if (requirements.has(requirement.id)) throw new TypeError('Duplicate requirement ID');
    requirements.set(requirement.id, requirement);
  }
  const assigned = new Map();
  for (const observation of observations) {
    object(observation, ['requirementId', 'scope', 'artifactVersion', 'observed', 'outcome']);
    id(observation.requirementId); text(observation.scope); text(observation.artifactVersion);
    if (typeof observation.observed !== 'boolean') throw new TypeError('Observed must be a boolean');
    if (observation.outcome !== undefined && !['pass', 'fail', 'unknown'].includes(observation.outcome)) throw new TypeError('Invalid observation outcome');
    if (!requirements.has(observation.requirementId)) throw new TypeError('Unknown observation requirement');
    if (assigned.has(observation.requirementId)) throw new TypeError('Multiple observations require explicit selection');
    assigned.set(observation.requirementId, observation);
  }
  const counts = { pass: 0, fail: 0, untested: 0, stale: 0, insufficient: 0, unknown: 0 };
  const results = [...requirements].map(([requirementId, requirement]) => {
    const status = outcomeFor(requirement, assigned.get(requirementId));
    counts[status]++;
    return { requirementId, status };
  });
  return { schemaVersion: 1, complete: counts.pass === results.length, counts, results };
}
