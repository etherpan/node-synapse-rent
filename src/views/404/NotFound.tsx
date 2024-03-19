import "src/views/404/NotFound.scss";

import OlympusLogo from "src/assets/Olympus Logo.svg";

export default function NotFound() {
  return (
    <div id="not-found">
      <div className="not-found-header">
        {/* <a href="" target="_blank" rel="noopener noreferrer"> */}
        <img className="branding-header-icon" src={OlympusLogo} alt="NodeSynapse" />
        {/* </a> */}
        <h1>Not Found</h1>
      </div>
    </div>
  );
}
