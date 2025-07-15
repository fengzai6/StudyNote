# useObjState

```ts
import { useState } from "react";

export const useObjState = <T extends Record<string, any>>(initialState: T) => {
  const [state, setState] = useState<T>(initialState);

  const setObjState = (newState: Partial<T>) => {
    setState((prevState) => ({ ...prevState, ...newState }));
  };

  return [state, setObjState] as const;
};
```
