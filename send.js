/* ============================================================
   TripleEight ── LINE送信の共通処理
   ------------------------------------------------------------
   ★ここだけ書き換えれば、全ページが「完全自動送信」になります★

   LINE Developers で LIFFアプリを作り、発行された LIFF ID を
   下の TE_LIFF_ID に入れてください（権限は chat_message.write が必須）。

   ・空のまま        → LINEが開いて内容が入力された状態になる（送信は本人がタップ）
   ・IDを入れた後    → LINEアプリ内で開いた場合、タップ不要で自動送信される
   ============================================================ */
window.TE_LIFF_ID = "";                 // 例: "2006383298-xxxxxxxx"
window.TE_LINE_OA = "%40210uvwaj";      // 公式LINEのID（変更不要）

window.sendToLine = async function (text, opts) {
  opts = opts || {};
  // ① LIFFが設定済み & LINEアプリ内 → 自動送信
  if (window.TE_LIFF_ID && window.liff && liff.isInClient && liff.isInClient()) {
    try {
      await liff.sendMessages([{ type: "text", text: text }]);
      if (opts.onSent) opts.onSent();
      setTimeout(function () { liff.closeWindow(); }, 900);
      return true;
    } catch (e) { /* 失敗したら②へ落ちる */ }
  }
  // ② それ以外 → LINEを開いて内容を入力した状態にする
  location.href = "https://line.me/R/oaMessage/" + window.TE_LINE_OA + "/?" + encodeURIComponent(text);
  return false;
};

/* LIFF SDKが読み込まれていれば初期化しておく */
(function () {
  if (window.TE_LIFF_ID && window.liff) {
    try { liff.init({ liffId: window.TE_LIFF_ID }); } catch (e) {}
  }
})();
