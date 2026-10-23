export type Status = 'pass' | 'fail' | 'untested' | 'stale' | 'insufficient' | 'unknown';
export interface Requirement { id: string; scope: string; artifactVersion: string }
export interface Observation { requirementId: string; scope: string; artifactVersion: string; observed: boolean; outcome?: 'pass' | 'fail' | 'unknown' }
export interface ReviewDocument { schemaVersion: 1; workflow?: string; requirements: readonly Requirement[]; observations?: readonly Observation[] }
export interface ReviewReport { schemaVersion: 1; complete: boolean; counts: Record<Status, number>; results: {requirementId: string; status: Status}[] }
export declare function outcomeFor(requirement: Pick<Requirement, 'scope' | 'artifactVersion'>, observation?: Pick<Observation, 'scope' | 'artifactVersion' | 'observed' | 'outcome'> | null): Status;
export declare function evaluateReview(document: ReviewDocument): ReviewReport;
