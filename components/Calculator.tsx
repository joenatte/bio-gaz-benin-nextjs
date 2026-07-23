"use client";

import { useState } from "react";

type Labels = {
  title: string;
  cattle: string;
  pigs: string;
  people: string;
  outVol: string;
  outGas: string;
  outHours: string;
  outSize: string;
  note: string;
};

export default function Calculator({
  params,
  labels,
}: {
  params: { yield: number; retention: number; cattle_kg: number; pig_kg: number; person_kg: number };
  labels: Labels;
}) {
  const [cattle, setCattle] = useState(2);
  const [pigs, setPigs] = useState(4);
  const [people, setPeople] = useState(6);

  const SAFETY = 1.15;
  const kgPerDay = cattle * params.cattle_kg + pigs * params.pig_kg + people * params.person_kg;
  const slurryLitersPerDay = kgPerDay * 2;
  const digesterM3 = (slurryLitersPerDay / 1000) * params.retention * SAFETY;
  const gasM3 = kgPerDay * params.yield;
  const hours = gasM3 / 0.25;
  const standard = [4, 6, 8, 10, 15, 20, 25, 30];
  const rec = standard.find((s) => s >= digesterM3);
  const recLabel = digesterM3 > 0 ? (rec !== undefined ? `${rec} m³` : `${standard[standard.length - 1]}+ m³`) : "–";

  return (
    <div className="calc">
      <h4>{labels.title}</h4>

      <div className="calc-field">
        <label>
          <span>{labels.cattle}</span>
          <span className="v">{cattle}</span>
        </label>
        <input type="range" min={0} max={20} value={cattle} onChange={(e) => setCattle(Number(e.target.value))} />
      </div>
      <div className="calc-field">
        <label>
          <span>{labels.pigs}</span>
          <span className="v">{pigs}</span>
        </label>
        <input type="range" min={0} max={40} value={pigs} onChange={(e) => setPigs(Number(e.target.value))} />
      </div>
      <div className="calc-field">
        <label>
          <span>{labels.people}</span>
          <span className="v">{people}</span>
        </label>
        <input type="range" min={0} max={20} value={people} onChange={(e) => setPeople(Number(e.target.value))} />
      </div>

      <div className="calc-results">
        <div className="calc-res-item">
          <div className="val">{digesterM3 > 0 ? `${digesterM3.toFixed(1)} m³` : "–"}</div>
          <div className="lbl">{labels.outVol}</div>
        </div>
        <div className="calc-res-item">
          <div className="val">{gasM3 > 0 ? `${gasM3.toFixed(2)} m³` : "–"}</div>
          <div className="lbl">{labels.outGas}</div>
        </div>
        <div className="calc-res-item">
          <div className="val">{hours > 0 ? `${hours.toFixed(1)}h` : "–"}</div>
          <div className="lbl">{labels.outHours}</div>
        </div>
        <div className="calc-res-item">
          <div className="val">{recLabel}</div>
          <div className="lbl">{labels.outSize}</div>
        </div>
      </div>

      <p className="calc-note">{labels.note}</p>
    </div>
  );
}
