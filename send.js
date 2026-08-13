/* ============================================================
   TripleEight ── LINE送信の共通処理
   ------------------------------------------------------------
   LIFF（LINE Front-end Framework）で、入力内容をトークへ自動送信します。

   送るのは2通です。
     1通目 = 合図の短い文（例「AIセットアップ会に申し込みます」）
              → 公式LINEの「キーワード応答」がこれに反応し、
                内容ごとに違う自動返信を出します。
     2通目 = 入力内容そのもの（記録用）

   ※LINEアプリの外（PCブラウザなど）で開かれた場合は、
     LINEを開いて内容を入力した状態にするだけになります（本人がタップ）。
   ============================================================ */
window.TE_LIFF_ID = "2011089376-l1Yx6Y3j";
window.TE_LINE_OA = "%40210uvwaj";

/* LIFFの初期化は1回だけ。各ページはこのPromiseを待つ */
window.TE_LIFF_READY = (function () {
  if (!window.TE_LIFF_ID || !window.liff) return Promise.resolve(false);
  return liff.init({ liffId: window.TE_LIFF_ID })
    .then(function () { return true; })
    .catch(function () { return false; });
})();

/**
 * @param {string} text    トークへ送る本文（入力内容）
 * @param {object} opts    { keyword: 合図の短文, onSent: 送信後に呼ばれる関数 }
 */
window.sendToLine = async function (text, opts) {
  opts = opts || {};
  var keyword = opts.keyword || "";

  var ready = false;
  try { ready = await window.TE_LIFF_READY; } catch (e) { ready = false; }

  if (ready && liff.isInClient()) {
    try {
      var msgs = [];
      if (keyword) msgs.push({ type: "text", text: keyword });
      msgs.push({ type: "text", text: text });
      await liff.sendMessages(msgs);
      if (opts.onSent) opts.onSent();
      setTimeout(function () { try { liff.closeWindow(); } catch (e) {} }, 1400);
      return true;
    } catch (e) { /* 失敗したら下の手動送信へ落ちる */ }
  }

  var body = (keyword ? keyword + "\n" : "") + text;
  location.href = "https://line.me/R/oaMessage/" + window.TE_LINE_OA + "/?" + encodeURIComponent(body);
  return false;
};
