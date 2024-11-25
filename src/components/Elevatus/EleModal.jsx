import React from 'react';

export function EleModal({ show, children }) {
  const showHideClassName = show ? 'modal display-block' : 'modal display-none';

  return (
    <div className={showHideClassName}>
      <section className="ele-modal-main">{children}</section>
    </div>
  );
}
