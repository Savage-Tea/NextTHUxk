chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'crossFetch') {
    fetch(msg.url, { credentials: 'include' })
      .then(resp => resp.arrayBuffer())
      .then(buf => {
        // Try GBK first for zhjw pages
        const raw = new TextDecoder().decode(buf);
        const hasGbk = raw.includes('charset=GBK') || raw.includes('charset=gb2312');
        const text = hasGbk ? new TextDecoder('gbk').decode(buf) : raw;
        sendResponse({ ok: true, text });
      })
      .catch(e => sendResponse({ ok: false, error: e.message }));
    return true; // async response
  }
});
