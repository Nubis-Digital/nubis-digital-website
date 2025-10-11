import { html, customElement, LitElement, property, css } from '@umbraco-cms/backoffice/external/lit';
import { UmbElementMixin } from '@umbraco-cms/backoffice/element-api';
import type { UmbBlockDataType } from '@umbraco-cms/backoffice/block';
import type { UmbBlockEditorCustomViewElement } from '@umbraco-cms/backoffice/block-custom-view';

@customElement('blog-code-custom-view')
export class BlogCodeCustomView extends UmbElementMixin(LitElement) implements UmbBlockEditorCustomViewElement {
	
	@property({ attribute: false })
	content?: UmbBlockDataType;

	render() {
		const code = this.content?.code || '';
		const language = this.content?.language || 'plaintext';
		const preview = code.substring(0, 100);
		
		return html`
			<div class="block-preview">
				<div class="block-header">
					<span class="block-icon">💻</span>
					<span class="block-title">Code Block</span>
					${language ? html`<span class="language-badge">${language}</span>` : ''}
				</div>
				<div class="block-content">
					${code ? html`
						<pre><code>${preview}${code.length > 100 ? '...' : ''}</code></pre>
					` : html`<p class="empty">No code yet...</p>`}
				</div>
			</div>
		`;
	}

	static styles = css`
		:host {
			display: block;
			height: 100%;
			box-sizing: border-box;
		}
		.block-preview {
			background: #1f2937;
			border: 1px solid #374151;
			border-radius: 8px;
			padding: 12px;
			height: 100%;
			display: flex;
			flex-direction: column;
		}
		.block-header {
			display: flex;
			align-items: center;
			gap: 8px;
			margin-bottom: 8px;
			font-weight: 600;
			color: #10b981;
		}
		.block-icon {
			font-size: 18px;
		}
		.block-title {
			font-size: 13px;
		}
		.language-badge {
			margin-left: auto;
			background: #374151;
			color: #9ca3af;
			padding: 2px 8px;
			border-radius: 4px;
			font-size: 11px;
			font-family: 'Courier New', monospace;
		}
		.block-content {
			flex: 1;
			background: #111827;
			border-radius: 4px;
			padding: 8px;
			overflow: hidden;
		}
		pre {
			margin: 0;
			font-size: 11px;
			line-height: 1.4;
		}
		code {
			color: #d1d5db;
			font-family: 'Courier New', monospace;
			white-space: pre-wrap;
			word-break: break-all;
		}
		.empty {
			font-style: italic;
			color: #6b7280;
			font-size: 12px;
			margin: 0;
		}
	`;
}

export default BlogCodeCustomView;

declare global {
	interface HTMLElementTagNameMap {
		'blog-code-custom-view': BlogCodeCustomView;
	}
}