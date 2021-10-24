export const createWelcomeDiv = () => {
  const div = document.createElement('div');
  div.id = 'welcome';
  div.innerHTML = `
    <div class="welcome-text">Your mission is to control character to collect 10 stars (score) and avoid bomb.</div>
    <div class="welcome-text">Use arrow <strong>left</strong> and <strong>right</strong> to move character. Use arrow <strong>up</strong> to shoot fireball to collect stars.</div>
    <div class="welcome-btn">Click to start game</div>
  `;

  document.body.appendChild(div);

  return div;
};