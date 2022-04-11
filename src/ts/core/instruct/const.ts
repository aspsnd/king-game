let autoIncreasedInstruct = 1024;

export const Instructs = {
  wantgo: autoIncreasedInstruct++,
  wantleft: autoIncreasedInstruct++,
  wantright: autoIncreasedInstruct++,
  continueleft: autoIncreasedInstruct++,
  continueright: autoIncreasedInstruct++,
  cancelleft: autoIncreasedInstruct++,
  cancelright: autoIncreasedInstruct++,
  wantjump: autoIncreasedInstruct++,
  wantdown: autoIncreasedInstruct++,
  wantdrop: autoIncreasedInstruct++,
  wantmobilestans: autoIncreasedInstruct++,
  wantmobilego: autoIncreasedInstruct++,
  wantmobilerun: autoIncreasedInstruct++
} as const;