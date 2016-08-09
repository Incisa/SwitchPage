# SwitchPage.js

Zepto 单例全屏滑动小插件, 支持移动端(需包含zepto touch), 支持每屏动画
[live demo](https://jiangshaokun.github.io/SwitchPage/)

## usage
1. 引入 `zepto.js`
2. 引入 `SwitchPage.js`
3. 调用

```
$("#container").switchPage()
```

使用自定义配置

```
$("#container").switchPage({
    'direction': 'h',
    'nav': true,
    'loop': true,
    'onPageSwitch': function() {
        console.log($.fn.switchPage.getActiveIndex())
    }
})
```

## config

### 可配置项

```
// 默认配置
var defaults = {
  'slides': '.slide', // 子容器
  'easing': 'ease',   // 特效方式，ease-in, ease-out, linear
  'duration': 1000,   // 每次动画执行的时间
  'nav': false,       // 是否显示分页
  'loop': false,      // 是否循环
  'keyboard': true,   // 是否支持键盘
  'direction': 'v',   // 滑动的方向 h - 水平, v - 垂直
  // 滑动回调, @param index {number} 换页后索引
  'onPageSwitch': function (index) {
    console.log('onPageSwitch')
  }
}
```

## API

### 暴露方法列表

```
- slidePrev() // 滑到上一页
- slideNext() // 滑到下一页
- lockSwipe() // 阻止触摸滑动(默认是允许的)
- unlockSwipe() // 允许触摸滑动
- getActiveIndex() // 获取当前页索引
```

### 调用方式
```
$.fn.switchPage.methodName()
```

## 注意事项
### 如需要使用每屏动画,需将动画挂在 `.active` 下面. 如给类名为 `text` 的元素做动画:
```
.active .text {
    padding: 30px;
    animation-name: slideUp;
    animation-duration: 1s;
    animation-delay: .3s;
    animation-fill-mode: both;
    animation-iteration-count: 1;
}

@keyframes slideUp {
    0% {
        opacity: 0;
        transform: translateY(200px);
    }
    100% {
        opacity: 1;
        transform: translateY(0px);
    }
}
```
### 只有一种切换方式 - slide
### 大概不支持 `IE8` 等低版本浏览器
### 循环并不好看
