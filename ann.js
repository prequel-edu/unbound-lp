/* Unbound announcement bar rotation (used by unbound.school + join.unbound.school) */
(function () {
  function rotate() {
    var a = document.getElementById('ann1');
    var b = document.getElementById('ann2');
    if (!a || !b) return;
    setInterval(function () {
      var showingFirst = a.style.display !== 'none';
      a.style.display = showingFirst ? 'none' : 'block';
      b.style.display = showingFirst ? 'block' : 'none';
    }, 4500);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', rotate);
  } else {
    rotate();
  }
})();
