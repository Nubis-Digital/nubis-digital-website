import { html, LitElement, css } from '@umbraco-cms/backoffice/external/lit';
import { UmbElementMixin } from '@umbraco-cms/backoffice/element-api';

export default class HeroSliderCustomView extends UmbElementMixin(LitElement) {
	
	static properties = {
		content: { type: Object, attribute: false }
	};

	constructor() {
		super();
		this.content = undefined;
	}

	render() {
		// Get the slides array from the content
		const slides = this.content?.slides.contentData || [];
		console.log(slides)
		const slideCount = slides.length;

		
		const autoPlay = this.content?.autoPlay || false;
		const autoPlayDelay = this.content?.autoPlayDelay || 5000;
		
		// Get first slide headline for preview
		let firstSlideHeadline = 'No slides added';
		if (slideCount > 0 && slides[0]?.values[1].value) {
			firstSlideHeadline = slides[0]?.values[1].value;
		}
		
		return html`
			<div class="block-preview">
				<div class="block-icon">🎬</div>
				<div class="block-content">
					<h5>Hero Slider <span class="slide-count">${slideCount} slide${slideCount !== 1 ? 's' : ''}</span></h5>
					<p class="headline">${firstSlideHeadline}</p>
					<div class="settings-info">
						${autoPlay ? html`
							<span class="setting-badge">
								▶️ Auto-play (${autoPlayDelay}ms)
							</span>
						` : html`
							<span class="setting-badge">
								⏸️ Manual
							</span>
						`}
					</div>
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
				pointer-events: none;
			}
			:host * {
				pointer-events: none;
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
			.slide-count {
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
				margin-bottom: 6px;
			}
			.settings-info {
				display: flex;
				gap: 6px;
				flex-wrap: wrap;
			}
			.setting-badge {
				font-size: 11px;
				font-weight: 500;
				padding: 2px 6px;
				background: var(--uui-color-surface-alt);
				color: var(--uui-color-text);
				border-radius: 3px;
				border: 1px solid var(--uui-color-border);
			}
		`,
	];
}

customElements.define('hero-slider-custom-view', HeroSliderCustomView);