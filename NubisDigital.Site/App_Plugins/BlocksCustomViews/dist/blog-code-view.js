import { html, LitElement, css } from '@umbraco-cms/backoffice/external/lit';
import { UmbElementMixin } from '@umbraco-cms/backoffice/element-api';

export default class BlogCodeCustomView extends UmbElementMixin(LitElement) {
	
	static properties = {
		content: { type: Object, attribute: false }
	};

	constructor() {
		super();
		this.content = undefined;
	}

	render() {
		const code = this.content?.code || '// Code snippet';
		const language = this.content?.language || 'text';
		
		// Get statistics
		const lines = code.split('\n');
		const lineCount = lines.length;
		const codePreview = lines.slice(0, 4).join('\n');
		const hasMore = lineCount > 4;
		const charCount = code.length;
		
		return html`
			<div class="block-preview">
				<div class="block-header">
					<div class="block-icon">💻</div>
					<div class="block-title">
						<h5>Code Block</h5>
					</div>
				</div>
				<div class="code-display">
					<div class="code-header">
						<span class="language-badge">${language.toUpperCase()}</span>
						<span class="line-info">${lineCount} line${lineCount !== 1 ? 's' : ''}</span>
					</div>
					<pre class="code-preview">${codePreview}${hasMore ? '\n...' : ''}</pre>
				</div>
				<div class="meta">
					<span class="badge">${lineCount} lines</span>
					<span class="badge">${charCount} chars</span>
					<span class="badge lang-badge">${language}</span>
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
				gap: 10px;
				padding: 14px;
				background: rgba(255, 255, 255, 0.7);
				backdrop-filter: blur(20px);
				-webkit-backdrop-filter: blur(20px);
				border: 1px solid rgba(148, 163, 184, 0.2);
				border-radius: 10px;
				box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
			}
			.block-header {
				display: flex;
				align-items: center;
				gap: 10px;
			}
			.block-icon {
				font-size: 22px;
				flex-shrink: 0;
				filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
			}
			.block-title {
				flex: 1;
				min-width: 0;
			}
			h5 {
				margin: 0;
				font-size: 11px;
				font-weight: 700;
				color: var(--uui-color-text-alt);
				text-transform: uppercase;
				letter-spacing: 0.8px;
			}
			.code-display {
				background: rgba(15, 23, 42, 0.95);
				backdrop-filter: blur(10px);
				-webkit-backdrop-filter: blur(10px);
				border: 1px solid rgba(148, 163, 184, 0.2);
				border-radius: 8px;
				overflow: hidden;
				flex: 1;
				display: flex;
				flex-direction: column;
			}
			.code-header {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 8px 12px;
				background: rgba(30, 41, 59, 0.8);
				border-bottom: 1px solid rgba(148, 163, 184, 0.1);
			}
			.language-badge {
				font-size: 10px;
				font-weight: 700;
				padding: 3px 8px;
				background: linear-gradient(135deg, #38bdf8, #818cf8);
				color: white;
				border-radius: 6px;
				letter-spacing: 0.5px;
				box-shadow: 0 2px 8px rgba(56, 189, 248, 0.3);
			}
			.line-info {
				font-size: 10px;
				color: rgba(255, 255, 255, 0.6);
				font-weight: 500;
			}
			.code-preview {
				margin: 0;
				padding: 12px;
				font-size: 11px;
				font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'Courier New', monospace;
				color: #e2e8f0;
				line-height: 1.5;
				overflow: hidden;
				white-space: pre;
				text-overflow: ellipsis;
				flex: 1;
			}
			.meta {
				display: flex;
				gap: 6px;
				flex-wrap: wrap;
				padding-top: 6px;
				border-top: 1px solid rgba(148, 163, 184, 0.15);
			}
			.badge {
				display: inline-flex;
				align-items: center;
				padding: 3px 8px;
				font-size: 10px;
				font-weight: 600;
				border-radius: 10px;
				letter-spacing: 0.3px;
				background: rgba(255, 255, 255, 0.5);
				backdrop-filter: blur(10px);
				-webkit-backdrop-filter: blur(10px);
				color: var(--uui-color-text);
				border: 1px solid rgba(148, 163, 184, 0.2);
			}
			.lang-badge {
				background: rgba(15, 23, 42, 0.8);
				color: #38bdf8;
				border: 1px solid rgba(56, 189, 248, 0.3);
				font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
			}
		`,
	];
}

customElements.define('blog-code-custom-view', BlogCodeCustomView);