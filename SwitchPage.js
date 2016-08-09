;(function ($) {
  // 默认配置
  var defaults = {
    'slides': '.slide', // 子容器
    'easing': 'ease', // 特效方式，ease-in, ease-out, linear
    'duration': 1000, // 每次动画执行的时间
    'nav': false, // 是否显示分页
    'loop': false, // 是否循环
    'keyboard': true, // 是否支持键盘
    'direction': 'v', // 滑动的方向 h - 水平, v - 垂直
    'onPageSwitch': function (index) {
      // 滑动回调
      console.log('onPageSwitch')
    }
  }

  var win = $(window)
  var container
  var slides

  var opts = {}
  var canScroll = true
  var canSwipe = true

  var iIndex = 0

  var slideArr = []

  /**
  * 注册为 zepto 插件
  * @param options {Object} 用户配置
  */
  var SP = $.fn.switchPage = function (options) {
    opts = $.extend({}, defaults, options || {}) // 覆盖默认配置
    container = $(this)
    slides = container.find(opts.slides)

    container.css({
      height: '100%',
      position: 'relative'
    })
    // 重写鼠标滑动事件
    container.on('mousewheel DOMMouseScroll', mouseWheelHandler)
    // 监听滑动事件
    container.on('swipeDown', SP.slidePrev)
    container.on('swipeUp', SP.slideNext)

    $(slides[0]).addClass('active') // 初始化 active index 为 0
    slides.css({
      height: '100%'
    })
    slides.each(function () {
      slideArr.push($(this))
    })

    return this.each(function () {
      if (opts.nav) {
        initNav()
      }
      if (opts.direction === 'h') {
        initLayout()
      }
      if (opts.keyboard) {
        keyDown()
      }
    })
  }

  /**
   * 暴露方法
   */

  // 滚轮向上滑动事件
  SP.slidePrev = function () {
    if (iIndex) {
      iIndex--
    } else if (opts.loop && iIndex === 0) {
      iIndex = slideArr.length - 1
    }
    initEffects(iIndex)
  }

  // 滚轮向下滑动事件
  SP.slideNext = function () {
    if (iIndex < (slideArr.length - 1)) {
      iIndex++
    } else if (opts.loop && iIndex === slideArr.length - 1) {
      iIndex = 0
    }
    initEffects(iIndex)
  }

  // 阻止滑动
  SP.lockSwipe = function () {
    if (canSwipe) {
      console.log('lockSwipe')
      canSwipe = false
      container.off('swipeDown', SP.slidePrev)
      container.off('swipeUp', SP.slideNext)
    }
  }

  // 允许滑动
  SP.unlockSwipe = function () {
    if (!canSwipe) {
      console.log('unlockSwipe')
      canSwipe = true
      container.on('swipeDown', SP.slidePrev)
      container.on('swipeUp', SP.slideNext)
    }
  }

  // 获取当前页索引
  SP.getActiveIndex = function () {
    return iIndex
  }

  /**
  * 私有方法
  */

  // 滚轮事件处理函数
  function mouseWheelHandler (e) {
    if (canScroll) {
      e = e || window.event
      e.preventDefault()

      var value = e.wheelDelta || -e.deltaY || -e.detail
      var delta = Math.max(-1, Math.min(1, value))

      if (delta < 0) {
        console.log('Next')
        SP.slideNext()
      } else {
        console.log('Prev')
        SP.slidePrev()
      }
    }
  }

  // 横向布局初始化
  function initLayout () {
    console.log('hhh')
    var length = slides.length
    var width = (length * 100) + '%'
    var cellWidth = (100 / length).toFixed(2) + '%'

    container.width(width).css('float', 'left')
    slides.width(cellWidth).css('float', 'left')

    if (opts.nav) {
      $('.slide-nav-wrap').addClass('slide-nav-wrap-h').removeClass('slide-nav-wrap')
    }
  }

  // 初始化分页
  function initNav () {
    var length = slides.length
    if (length) {}
    var pageHtml = '<ul class="slide-nav-wrap"><li class="slide-nav active" data-nav="0"></li>'
    for (var i = 1; i < length; i++) {
      pageHtml += '<li class="slide-nav" data-nav="' + i + '"></li>'
    }
    pageHtml += '</ul>'
    $('body').append(pageHtml)
    $('.slide-nav').click(function (e) {
      var targetSlideIndex = this.dataset.nav

      initEffects(targetSlideIndex)
    })
  }

  // 分页事件
  function navHandler (targetIndex) {
    var slideNavs = $('.slide-nav')
    slideNavs.eq(targetIndex).addClass('active').siblings().removeClass('active')
  }

  // 渲染效果
  function initEffects (iIndex) {
    canScroll = false
    setTimeout(function () {
      canScroll = true
      opts.onPageSwitch(iIndex)
    }, opts.duration + 600)

    var transform = ['-webkit-transform', '-ms-transform', '-moz-transform', 'transform']
    var transition = ['-webkit-transition', '-ms-transition', '-moz-transition', 'transition']
    var traslate = ''
    var styleObj = {}
    var activeSlide = slideArr[iIndex]
    var dest = activeSlide.position()

    if (opts.direction === 'h') {
      traslate = '-' + dest.left + 'px, 0px, 0px'
    } else {
      traslate = '0px, -' + dest.top + 'px, 0px'
    }

    transition.forEach(function (value) {
      styleObj[value] = 'all ' + opts.duration + 'ms ' + opts.easing
    })
    transform.forEach(function (value) {
      styleObj[value] = 'translate3d(' + traslate + ')'
    })

    container.css(styleObj)
    activeSlide.addClass('active').siblings().removeClass('active')

    if (opts.nav) {
      navHandler(iIndex)
    }
  }

  // 窗口Resize
  var resizeId
  win.resize(function () {
    clearTimeout(resizeId)
    resizeId = setTimeout(function () {
      reBuild()
    }, 500)
  })

  function reBuild () {
    if (iIndex) {
      initEffects(iIndex)
    }
  }

  // 绑定键盘事件
  function keyDown () {
    var keydownId
    win.keydown(function (e) {
      clearTimeout(keydownId)
      keydownId = setTimeout(function () {
        var keyCode = e.keyCode
        if (keyCode === 37 || keyCode === 38) {
          SP.slidePrev()
        } else if (keyCode === 39 || keyCode === 40) {
          SP.slideNext()
        }
      }, 150)
    })
  }
})(Zepto)
