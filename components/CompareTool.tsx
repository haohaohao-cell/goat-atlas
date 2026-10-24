"use client";

import { useMemo, useState } from "react";
import type { CompareData, CompareMetric, ComparePlayer } from "@/lib/types";
import { ArrowUpRight, SparkIcon } from "./Icons";

type Winner = "ronaldo" | "messi" | "tie";

function metricWinner(metric: CompareMetric, data: CompareData): Winner {
  const ronaldo = metric.values[data.players[0].id] ?? 0;
  const messi = metric.values[data.players[1].id] ?? 0;
  if (ronaldo === messi) return "tie";
  return ronaldo > messi ? "ronaldo" : "messi";
}

function PlayerCard({
  player,
  score,
  wins,
}: {
  player: ComparePlayer;
  score: number;
  wins: number;
}) {
  return (
    <article className={`compare-player is-${player.accent}`}>
      <div className="compare-player-top">
        <span>{player.country}</span>
        <strong>{score}</strong>
      </div>
      <div className="compare-player-main">
        <h2>{player.nameZh}</h2>
        <p>{player.name}</p>
      </div>
      <div className="compare-player-foot">
        <span>{wins} 个维度领先</span>
        <span>GOAT INDEX</span>
      </div>
      <div className="compare-player-sources">
        {player.sources.map((source) => (
          <a key={source.url} href={source.url} target="_blank" rel="noreferrer">
            {source.label}
            <ArrowUpRight />
          </a>
        ))}
      </div>
    </article>
  );
}

export function CompareTool({ data }: { data: CompareData }) {
  const defaults = useMemo(
    () =>
      Object.fromEntries(
        data.metrics.map((metric) => [metric.id, metric.defaultWeight]),
      ) as Record<string, number>,
    [data.metrics],
  );
  const [weights, setWeights] = useState<Record<string, number>>(defaults);

  const totalWeight = data.metrics.reduce(
    (total, metric) => total + (weights[metric.id] ?? 0),
    0,
  );

  let ronaldoWeight = 0;
  let ronaldoWins = 0;
  let messiWins = 0;
  let ties = 0;

  for (const metric of data.metrics) {
    const winner = metricWinner(metric, data);
    const weight = weights[metric.id] ?? 0;

    if (winner === "ronaldo") {
      ronaldoWins += 1;
      ronaldoWeight += weight;
    } else if (winner === "messi") {
      messiWins += 1;
    } else {
      ties += 1;
      ronaldoWeight += weight / 2;
    }
  }

  const ronaldoScore =
    totalWeight > 0 ? Math.round((ronaldoWeight / totalWeight) * 100) : 50;
  const messiScore = 100 - ronaldoScore;

  function setWeight(id: string, value: number) {
    setWeights((previous) => ({ ...previous, [id]: value }));
  }

  function reset() {
    setWeights(defaults);
  }

  function equalize() {
    setWeights(
      Object.fromEntries(data.metrics.map((metric) => [metric.id, 15])),
    );
  }

  return (
    <div className="compare-shell">
      <div className="compare-scoreboard">
        <PlayerCard
          player={data.players[0]}
          score={ronaldoScore}
          wins={ronaldoWins}
        />
        <div className="compare-vs" aria-hidden="true">
          <span>VS</span>
          <em>WEIGHTED</em>
        </div>
        <PlayerCard
          player={data.players[1]}
          score={messiScore}
          wins={messiWins}
        />
      </div>

      <div className="compare-meter" aria-label="加权得分">
        <div className="compare-meter-labels">
          <span>C罗 {ronaldoScore}</span>
          <span>梅西 {messiScore}</span>
        </div>
        <div className="compare-meter-track">
          <span
            className="compare-meter-gold"
            style={{ width: `${ronaldoScore}%` }}
          />
          <span
            className="compare-meter-blue"
            style={{ width: `${messiScore}%` }}
          />
        </div>
      </div>

      <div className="compare-toolbar">
        <p>
          默认等权：<strong>{ronaldoWins}</strong> : <strong>{messiWins}</strong>
          {ties ? ` · ${ties} 项持平` : ""}。
          <span> 调权重，看结论怎么变。</span>
        </p>
        <div>
          <button type="button" className="text-button" onClick={reset}>
            重置默认
          </button>
          <button type="button" className="text-button" onClick={equalize}>
            全部等权
          </button>
        </div>
      </div>

      <div className="compare-metrics">
        {data.metrics.map((metric) => {
          const ronaldoValue = metric.values[data.players[0].id] ?? 0;
          const messiValue = metric.values[data.players[1].id] ?? 0;
          const winner = metricWinner(metric, data);
          const weight = weights[metric.id] ?? 0;

          return (
            <article
              className={`compare-metric ${winner === "tie" ? "is-tie" : ""}`}
              key={metric.id}
            >
              <div className="compare-metric-head">
                <div>
                  <h3>{metric.label}</h3>
                  <span>{metric.short}</span>
                </div>
                <a href={metric.source} target="_blank" rel="noreferrer">
                  来源
                  <ArrowUpRight />
                </a>
              </div>

              <div className="compare-values">
                <div className={winner === "ronaldo" ? "is-win" : ""}>
                  <strong>
                    {ronaldoValue}
                    <em>{metric.unit}</em>
                  </strong>
                  <span>C罗</span>
                </div>
                <span className="compare-vs-small">VS</span>
                <div className={winner === "messi" ? "is-win" : ""}>
                  <strong>
                    {messiValue}
                    <em>{metric.unit}</em>
                  </strong>
                  <span>梅西</span>
                </div>
              </div>

              <label className="compare-weight">
                <span>
                  权重 <em>{weight}</em>
                </span>
                <input
                  type="range"
                  min="0"
                  max="30"
                  step="1"
                  value={weight}
                  onChange={(event) =>
                    setWeight(metric.id, Number(event.target.value))
                  }
                  aria-label={`${metric.label} 的权重`}
                />
              </label>

              {metric.note ? (
                <p className="compare-metric-note">{metric.note}</p>
              ) : null}
            </article>
          );
        })}
      </div>

      <div className="compare-footnote">
        <SparkIcon />
        <p>
          这不是“客观 GOAT 结论”。它只把可核实的指标摆在一起，
          权重由你决定。想换指标、补来源，欢迎开 issue。
        </p>
      </div>
    </div>
  );
}
