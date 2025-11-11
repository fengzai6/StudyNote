# CSS 暗黑模式

使用 filter 一键让网页颜色反转

```css
html {
  filter: invert(1) hue-rotate(180deg);
}
```

可以对不需要暗黑的元素进行再次反转(叠加了html 的过滤等于没过滤)

```css
img, video, iframe {
  filter: invert(1) hue-rotate(180deg);
}
```

