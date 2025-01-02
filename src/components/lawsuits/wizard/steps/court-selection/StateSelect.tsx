import React from 'react';
import { Select } from '../../../../shared/ui/Select';

interface StateSelectProps {
  value: string;
  onChange: (state: string) => void;
}

export function StateSelect({ value, onChange }: StateSelectProps) {
  return (
    <Select
      label="State/Territory"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
    >
      <option value="">Select jurisdiction</option>
      <optgroup label="Federal Courts">
        <option value="ussc">U.S. Supreme Court</option>
        <option value="fed_1st">U.S. Court of Appeals for the First Circuit</option>
        <option value="fed_2nd">U.S. Court of Appeals for the Second Circuit</option>
        <option value="fed_3rd">U.S. Court of Appeals for the Third Circuit</option>
        <option value="fed_4th">U.S. Court of Appeals for the Fourth Circuit</option>
        <option value="fed_5th">U.S. Court of Appeals for the Fifth Circuit</option>
        <option value="fed_6th">U.S. Court of Appeals for the Sixth Circuit</option>
        <option value="fed_7th">U.S. Court of Appeals for the Seventh Circuit</option>
        <option value="fed_8th">U.S. Court of Appeals for the Eighth Circuit</option>
        <option value="fed_9th">U.S. Court of Appeals for the Ninth Circuit</option>
        <option value="fed_10th">U.S. Court of Appeals for the Tenth Circuit</option>
        <option value="fed_11th">U.S. Court of Appeals for the Eleventh Circuit</option>
        <option value="fed_dc">U.S. Court of Appeals for the D.C. Circuit</option>
        <option value="fed_federal">U.S. Court of Appeals for the Federal Circuit</option>
        <option value="district">U.S. District Court</option>
        <option value="bankruptcy">U.S. Bankruptcy Court</option>
      </optgroup>
      <optgroup label="State Courts">
        <option value="al">Alabama</option>
        <option value="ak">Alaska</option>
        <option value="az">Arizona</option>
        <option value="ar">Arkansas</option>
        <option value="ca">California</option>
        <option value="co">Colorado</option>
        <option value="ct">Connecticut</option>
        <option value="de">Delaware</option>
        <option value="fl">Florida</option>
        <option value="ga">Georgia</option>
        <option value="hi">Hawaii</option>
        <option value="id">Idaho</option>
        <option value="il">Illinois</option>
        <option value="in">Indiana</option>
        <option value="ia">Iowa</option>
        <option value="ks">Kansas</option>
        <option value="ky">Kentucky</option>
        <option value="la">Louisiana</option>
        <option value="me">Maine</option>
        <option value="md">Maryland</option>
        <option value="ma">Massachusetts</option>
        <option value="mi">Michigan</option>
        <option value="mn">Minnesota</option>
        <option value="ms">Mississippi</option>
        <option value="mo">Missouri</option>
        <option value="mt">Montana</option>
        <option value="ne">Nebraska</option>
        <option value="nv">Nevada</option>
        <option value="nh">New Hampshire</option>
        <option value="nj">New Jersey</option>
        <option value="nm">New Mexico</option>
        <option value="ny">New York</option>
        <option value="nc">North Carolina</option>
        <option value="nd">North Dakota</option>
        <option value="oh">Ohio</option>
        <option value="ok">Oklahoma</option>
        <option value="or">Oregon</option>
        <option value="pa">Pennsylvania</option>
        <option value="ri">Rhode Island</option>
        <option value="sc">South Carolina</option>
        <option value="sd">South Dakota</option>
        <option value="tn">Tennessee</option>
        <option value="tx">Texas</option>
        <option value="ut">Utah</option>
        <option value="vt">Vermont</option>
        <option value="va">Virginia</option>
        <option value="wa">Washington</option>
        <option value="wv">West Virginia</option>
        <option value="wi">Wisconsin</option>
        <option value="wy">Wyoming</option>
      </optgroup>
      <optgroup label="Territories">
        <option value="dc">District of Columbia</option>
        <option value="pr">Puerto Rico</option>
        <option value="gu">Guam</option>
        <option value="vi">U.S. Virgin Islands</option>
        <option value="mp">Northern Mariana Islands</option>
        <option value="as">American Samoa</option>
      </optgroup>
    </Select>
  );
}