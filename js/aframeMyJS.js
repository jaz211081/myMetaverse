// 小視窗點擊後開啟正確文件
AFRAME.registerComponent('click-show-window', {
  init: function () {
    var el = this.el;
    el.addEventListener('click', function () {
      var fileName = el.getAttribute('data-file');
      if (fileName) {
        var infoWindow = document.getElementById('infoWindow');
        if (fileName.startsWith('https://script.google.com/')) {
          // 如果是 Google Sheet 的網址，則抓取資料
          fetchGoogleSheetData(fileName);
        } else {
          // 否則，抓取普通文件
          fetch(fileName)
            .then(response => response.text())
            .then(data => {
              document.getElementById('infoContent').innerHTML = data; // Use innerHTML to allow HTML tags
              infoWindow.style.display = 'block';
              addLinkEventListeners(); // 添加对链接点击事件的监听
            })
            .catch(error => console.error('Error loading message:', error));
        }
      }
    });
  }
});

// 新增函數來抓取 Google Sheet 資料
function fetchGoogleSheetData(sheetUrl) {
  fetch(sheetUrl)
    .then(response => response.json())
    .then(data => {
      let content = '';
      data.forEach(row => {
        content += `<p>${row}</p>`;  // 假設每一列的內容都顯示在 <p> 標籤中
      });
      document.getElementById('infoContent').innerHTML = content;
      document.getElementById('infoWindow').style.display = 'block';
      addLinkEventListeners(); // 添加链接事件监听
    })
    .catch(error => console.error('Error fetching Google Sheet data:', error));
}

// 小視窗內部資訊更新
function addLinkEventListeners() {
  var links = document.getElementById('infoWindow').querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', function (event) {
      if (link.getAttribute('target') === '_blank') {
        // 允许外部链接打开
        return;
      }
      event.preventDefault(); // 阻止默认行为
      var fileName = link.getAttribute('href');
      if (fileName) {
        fetch(fileName)
          .then(response => response.text())
          .then(data => {
            document.getElementById('infoContent').innerHTML = data; // 更新内容
            addLinkEventListeners(); // 递归调用以添加新内容中的链接事件监听
          })
          .catch(error => console.error('Error loading message:', error));
      }
    });
  });
}

function closeWindow() {
  var infoWindow = document.getElementById('infoWindow');
  stopAllVideos(infoWindow); // 停止所有影片
  infoWindow.style.display = 'none';
}

function stopAllVideos(container) {
  var videos = container.querySelectorAll('video');
  videos.forEach(video => {
    video.pause();
    video.currentTime = 0;
  });
  
  var iframes = container.querySelectorAll('iframe');
  iframes.forEach(iframe => {
    var src = iframe.src;
    iframe.src = src; // 重新加载iframe以停止视频播放
  });
}

function topLeftButtonAction() {
  var button = document.querySelector('.top-left-button');
  var filePath = button.getAttribute('data-file');
  var infoWindowCenter = document.getElementById('infoWindowCenter');

  fetch(filePath) // 使用从按钮获取的文件路径
    .then(response => response.text())
    .then(data => {
      document.getElementById('infoContentCenter').innerHTML = data;
      infoWindowCenter.style.display = 'block';
      infoWindowCenter.style.top = '50%'; // 将窗口置于屏幕中央
      infoWindowCenter.style.left = '50%';
      infoWindowCenter.style.transform = 'translate(-50%, -50%)'; // 将窗口置于屏幕中央
      addLinkEventListeners();
    })
    .catch(error => console.error('Error loading message:', error));
}

function closeWindowCenter() {
  var infoWindowCenter = document.getElementById('infoWindowCenter');
  stopAllVideos(infoWindowCenter);
  infoWindowCenter.style.display = 'none';
}

AFRAME.registerComponent('hover-opacity', {
  init: function () {
      var el = this.el;

      // 如果元素的ID不是 tpeOleHome，則設置 hover 行為
      if (el.getAttribute('id') !== 'tpeOleHome') {
          el.setAttribute('material', 'opacity', 0.2); // 初始設置透明度為 20%

          // 當滑鼠進入時
          el.addEventListener('mouseenter', function () {
              el.setAttribute('material', 'opacity', 1.0); // 設置為不透明
          });

          // 當滑鼠離開時
          el.addEventListener('mouseleave', function () {
              el.setAttribute('material', 'opacity', 0.2); // 恢復為 20% 透明度
          });
      }
  }
});
