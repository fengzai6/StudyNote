## React useCallback Hook

`useCallback` 是一个允许你在多次渲染中缓存函数的 React Hook，用于优化性能

```
const cachedValue = useMemo(calculateValue, dependencies)
```

和useMemo使用起来很像，但是不同的是useMemo中的函数是无参数函数，而useCallback中的函数可以接受任何参数并且返回任何值，而useMemo得到的是计算出的数据，而useCallback得到的是缓存的函数

例子

