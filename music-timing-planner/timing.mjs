// Pure timing arithmetic: no audio files, network requests, or beat detection.
export function planTiming({sourceSeconds,targetSeconds,bpm,beatsPerBar=4,barsPerPhrase=4}) {
  for(const [key,value] of Object.entries({sourceSeconds,targetSeconds,bpm,beatsPerBar,barsPerPhrase})) {
    if(typeof value!=='number'||!Number.isFinite(value)||value<=0)throw new RangeError(`${key} must be a positive finite number`);
  }
  if(!Number.isInteger(beatsPerBar)||!Number.isInteger(barsPerPhrase))throw new RangeError('Bar and phrase counts must be integers');
  const deltaSeconds=targetSeconds-sourceSeconds;
  const phraseSeconds=60/bpm*beatsPerBar*barsPerPhrase;
  const phraseCount=Math.abs(deltaSeconds)/phraseSeconds;
  return {deltaSeconds,action:deltaSeconds>0?'extend':deltaSeconds<0?'shorten':'keep',phraseSeconds,phraseCount,wholePhrases:Math.floor(phraseCount),remainderSeconds:Math.abs(deltaSeconds)-Math.floor(phraseCount)*phraseSeconds};
}
export function continuationEnd(pointSeconds,newSeconds) {
  if(!Number.isFinite(pointSeconds)||pointSeconds<0||!Number.isFinite(newSeconds)||newSeconds<=0)throw new RangeError('Use a nonnegative continuation point and positive new duration');
  return pointSeconds+newSeconds;
}
