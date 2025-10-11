import { html, LitElement, css } from '@umbraco-cms/backoffice/external/lit';
import { UmbElementMixin } from '@umbraco-cms/backoffice/element-api';

export default class HeroBannerCustomView extends UmbElementMixin(LitElement) {
	
	static properties = {
		content: { type: Object, attribute: false }
	};

	constructor() {
		super();
		this.content = undefined;
	}

	render() {
		const headline = this.content?.headline || 'Hero Banner';
		const heroStyle = this.content?.heroStyle || 'Centered';
		const hasCTA = this.content?.primaryCtaText || this.content?.secondaryCtaText;
		
		return html`
			<div class="block-preview">
				<div class="block-icon">🎯</div>
				<div class="block-content">
					<h5>Hero Banner <span class="style-badge">${heroStyle}</span></h5>
					<p class="headline">${headline}</p>
					${hasCTA ? html`<p class="cta-info">✓ Has CTA buttons</p>` : ''}
				</div>
			</div>
		`;
	}

	static styles = [
		css`
			:host {
				display: block;
				height: 100%;
				box-sizing: border-box;
			}
			.block-preview {
				display: flex;
				align-items: flex-start;
				gap: 12px;
				padding: 12px;
				background: var(--uui-color-surface);
				border: 1px solid var(--uui-color-border);
				border-radius: 6px;
				height: 100%;
			}
			.block-icon {
				font-size: 24px;
				flex-shrink: 0;
			}
			.block-content {
				flex: 1;
				min-width: 0;
			}
			h5 {
				margin: 0 0 4px 0;
				font-size: 14px;
				font-weight: 600;
				color: var(--uui-color-text);
				display: flex;
				align-items: center;
				gap: 8px;
			}
			.style-badge {
				font-size: 11px;
				font-weight: 500;
				padding: 2px 6px;
				background: var(--uui-color-selected);
				color: var(--uui-color-selected-contrast);
				border-radius: 3px;
			}
			p {
				margin: 0;
				font-size: 12px;
				color: var(--uui-color-text-alt);
			}
			.headline {
				font-weight: 600;
				color: var(--uui-color-text);
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				margin-bottom: 4px;
			}
			.cta-info {
				font-size: 11px;
				color: var(--uui-color-positive);
			}
		`,
	];
}

customElements.define('hero-banner-custom-view', HeroBannerCustomView);