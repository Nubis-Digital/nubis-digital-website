import { content } from '@/data/content'

import type { AgentPhase } from './storyMotion'

export interface AgentExchangeProps { phase: AgentPhase }

/**
 * The phone-side half of the finale: the visitor's question, the answer the
 * assistant composes from approved knowledge, and the human-oversight chip in
 * peri violet. Every part is always in the DOM and in reading order —
 * `data-phase` only paces what the enhanced stage *shows*, so assistive tech
 * and the static fallback always get the whole exchange.
 */
export function AgentExchange({ phase }: AgentExchangeProps) {
  const { agent } = content.story

  return (
    <section className="story-agent" aria-label="Governed agent recommendation" data-agent-exchange data-phase={phase}>
      <dl>
        <div className="story-agent__question"><dt>Visitor need</dt><dd>{agent.visitorNeed}</dd></div>
        <div className="story-agent__source"><dt>Approved knowledge</dt><dd>Verified site content</dd></div>
        <div className="story-agent__answer"><dt>Recommendation</dt><dd>{agent.recommendation}</dd></div>
      </dl>
      <ul className="story-agent__steps" aria-label="Automated follow-up">
        {agent.automation.map((step) => <li key={step}>{step}</li>)}
      </ul>
      <p className="story-agent__oversight">
        <span className="story-agent__review">{agent.oversightLabel}</span>
        <span className="story-agent__approved" aria-hidden="true">{agent.approvalLabel}</span>
      </p>
      <button type="button" disabled aria-disabled="true">{agent.approvalLabel}</button>
    </section>
  )
}
