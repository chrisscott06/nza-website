import { useEffect } from 'react'
import type { Client } from '../data/clients'

/**
 * Centred popover for a client. Header (logo + meta), two-column body
 * (what we did / capabilities), hairline footer with period · type · scope.
 *
 * Source: nza-website.html lines 1468-1499 + the openClient JS.
 */
type Props = {
  client: Client | null
  onClose: () => void
}

export function ClientPopover({ client, onClose }: Props) {
  // Close on Esc.
  useEffect(() => {
    if (!client) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [client, onClose])

  if (!client) return null

  // Footer chips: split on `·` and label first three slots Period / Engagement / Scope.
  const parts = client.footer.split('·').map((s) => s.trim()).filter(Boolean)
  const chipLabels = ['Period', 'Engagement', 'Scope']

  return (
    <div className="client-popover open" id="clientPopover">
      <div className="client-popover-backdrop" data-popover-close onClick={onClose} />
      <div className="client-popover-panel" role="dialog" aria-modal="true" aria-labelledby="clientPopoverName">
        <button className="client-popover-close" data-popover-close aria-label="Close" onClick={onClose}>
          ×
        </button>

        <div className="client-popover-header">
          <div className="client-popover-mark" id="clientPopoverMark">
            <img src={client.logoCoralSrc || client.logoSrc} alt={client.name} className="client-logo-img" />
          </div>
          <div className="client-popover-meta-block">
            <div className="client-popover-eyebrow" id="clientPopoverSector">{client.sector}</div>
            <h3 className="client-popover-name" id="clientPopoverName">{client.name}</h3>
            <p className="client-popover-context" id="clientPopoverContext">{client.context}</p>
          </div>
        </div>

        <div className="client-popover-body">
          <div className="client-popover-col client-popover-col-wide">
            <div className="client-popover-col-label">
              <span className="client-popover-dot" aria-hidden="true" />What we did
            </div>
            <p className="client-popover-col-text" id="clientPopoverWhat">{client.what}</p>
          </div>
          <div className="client-popover-col client-popover-col-narrow">
            <div className="client-popover-col-label">
              <span className="client-popover-dot" aria-hidden="true" />Capabilities
            </div>
            <ul className="client-popover-caps" id="clientPopoverCaps">
              {client.capabilities.map((cap) => <li key={cap}>{cap}</li>)}
            </ul>
          </div>
        </div>

        <div className="client-popover-footer" id="clientPopoverFooter">
          {parts.map((val, idx) => (
            <div key={idx} className="client-popover-footer-chip">
              <span className="client-popover-footer-chip-label">{chipLabels[idx] || ''}</span>
              <span className="client-popover-footer-chip-value">{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
