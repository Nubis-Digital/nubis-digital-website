import { html, LitElement, css } from '@umbraco-cms/backoffice/external/lit';
import { UmbElementMixin } from '@umbraco-cms/backoffice/element-api';

export default class LatestBlogPostsCustomView extends UmbElementMixin(LitElement) {
	
	static properties = {
		content: { type: Object, attribute: false }
	};

	constructor() {
		super();
		this.content = undefined;
	}

	render() {
		const headline = this.content?.headline || 'Latest Blog Posts';
		const description = this.content?.description || '';
		const numberOfPosts = this.content?.numberOfPostsToShow || 3;
		const displayStyle = this.content?.displayStyle || 'Grid';
		
		return html`
			<div class="block-preview">
				<div class="block-header">
					<div class="block-icon">📰</div>
					<div class="block-title">
						<h5>Latest Blog Posts</h5>
						<p class="headline">${headline}</p>
					</div>
				</div>
				
				${description ? html`
					<div class="description">${description.substring(0, 80)}${description.length > 80 ? '...' : ''}</div>
				` : ''}
				
				<div class="posts-preview">
					${Array.from({length: Math.min(numberOfPosts, 3)}).map((_, i) => html`
						<div class="post-card">
							<div class="post-icon">📄</div>
							<span class="post-label">Post ${i + 1}</span>
						</div>
					`)}
					${numberOfPosts > 3 ? html`
						<div class="post-card more">
							<span class="more-count">+${numberOfPosts - 3}</span>
						</div>
					` : ''}
				</div>
				
				<div class="meta">
					<span class="badge count-badge">${numberOfPosts} post${numberOfPosts !== 1 ? 's' : ''}</span>
					<span class="badge style-badge">${displayStyle} layout</span>
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
				flex-direction: column;
				gap: 12px;
				padding: 16px;
				background: rgba(255, 255, 255, 0.7);
				backdrop-filter: blur(20px);
				-webkit-backdrop-filter: blur(20px);
				border: 1px solid rgba(148, 163, 184, 0.2);
				border-radius: 12px;
				height: 100%;
				box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
			}
			.block-header {
				display: flex;
				align-items: flex-start;
				gap: 12px;
			}
			.block-icon {
				font-size: 28px;
				flex-shrink: 0;
				filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
			}
			.block-title {
				flex: 1;
				min-width: 0;
			}
			h5 {
				margin: 0 0 4px 0;
				font-size: 11px;
				font-weight: 700;
				color: var(--uui-color-text-alt);
				text-transform: uppercase;
				letter-spacing: 0.8px;
			}
			.headline {
				margin: 0;
				font-size: 15px;
				font-weight: 600;
				color: var(--uui-color-text);
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			.description {
				font-size: 12px;
				color: var(--uui-color-text-alt);
				padding: 8px;
				background: rgba(255, 255, 255, 0.5);
				backdrop-filter: blur(10px);
				-webkit-backdrop-filter: blur(10px);
				border: 1px solid rgba(148, 163, 184, 0.15);
				border-radius: 8px;
				line-height: 1.4;
			}
			.posts-preview {
				display: grid;
				grid-template-columns: repeat(2, 1fr);
				gap: 8px;
				margin: 4px 0;
			}
			.post-card {
				display: flex;
				align-items: center;
				gap: 6px;
				padding: 8px;
				background: rgba(255, 255, 255, 0.5);
				backdrop-filter: blur(10px);
				-webkit-backdrop-filter: blur(10px);
				border: 1px solid rgba(148, 163, 184, 0.15);
				border-radius: 8px;
				font-size: 12px;
				box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
			}
			.post-icon {
				font-size: 14px;
				flex-shrink: 0;
			}
			.post-label {
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				color: var(--uui-color-text);
				font-weight: 500;
			}
			.post-card.more {
				justify-content: center;
				background: rgba(255, 255, 255, 0.3);
				border-style: dashed;
			}
			.more-count {
				color: var(--uui-color-text-alt);
				font-weight: 600;
				font-size: 11px;
			}
			.meta {
				display: flex;
				gap: 6px;
				flex-wrap: wrap;
				padding-top: 8px;
				border-top: 1px solid rgba(148, 163, 184, 0.15);
			}
			.badge {
				display: inline-flex;
				align-items: center;
				padding: 4px 10px;
				font-size: 11px;
				font-weight: 600;
				border-radius: 12px;
				letter-spacing: 0.3px;
			}
			.count-badge {
				background: linear-gradient(135deg, #38bdf8, #818cf8);
				color: white;
				box-shadow: 0 2px 8px rgba(56, 189, 248, 0.3);
			}
			.style-badge {
				background: rgba(255, 255, 255, 0.5);
				backdrop-filter: blur(10px);
				-webkit-backdrop-filter: blur(10px);
				color: var(--uui-color-text);
				border: 1px solid rgba(148, 163, 184, 0.2);
			}
		`,
	];
}

customElements.define('latest-blog-posts-custom-view', LatestBlogPostsCustomView);