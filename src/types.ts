import { Datum } from "plotly.js";
import { ColorSchemeArray, ColorSchemeNames } from "./color-schemes";
import { TimeDurationStr } from "./duration/duration";
import {
  AutoPeriodConfig,
  StatisticPeriod,
  StatisticType,
  StatisticValue,
} from "./recorder-types";

import { HassEntity } from "home-assistant-js-websocket";
import { FilterFn } from "./filters/filters";
export { HassEntity } from "home-assistant-js-websocket";
export type InputConfig = {
  type: "custom:plotly-graph-card";
  hours_to_show?: number;
  refresh_interval?: number | "auto"; // in seconds
  color_scheme?: ColorSchemeNames | ColorSchemeArray | number;
  title?: string;
  offset?: TimeDurationStr;
  entities: ({
    entity: string;
    attribute?: string;
    statistic?: StatisticType;
    period?: StatisticPeriod | "auto" | AutoPeriodConfig;
    unit_of_measurement?: string;
    lambda?: string;
    show_value?:
      | boolean
      | {
          right_margin: number;
        };
    offset?: TimeDurationStr;
    extend_to_present?: boolean;
    filters?: `${number} -> ${number}`[];
  } & Partial<Plotly.PlotData>)[];
  defaults?: {
    entity?: Partial<Plotly.PlotData>;
    yaxes?: Partial<Plotly.Layout["yaxis"]>;
  };
  layout?: Partial<Plotly.Layout>;
  config?: Partial<Plotly.Config>;
  no_theme?: boolean;
  no_default_layout?: boolean;
  significant_changes_only?: boolean; // defaults to false
  minimal_response?: boolean; // defaults to true
};

export type EntityConfig = EntityIdConfig & {
  unit_of_measurement?: string;
  lambda?: (
    y: Datum[],
    x: Datum[],
    raw_entity: CachedEntity[]
  ) => Datum[] | { x?: Datum[]; y?: Datum[] };
  show_value:
    | boolean
    | {
        right_margin: number;
      };
  offset: number;
  extend_to_present: boolean;
  filters: FilterFn[];
} & Partial<Plotly.PlotData>;

export type Config = {
  title?: string;
  hours_to_show: number;
  refresh_interval: number | "auto"; // in seconds
  offset: number;
  entities: EntityConfig[];
  layout: Partial<Plotly.Layout>;
  config: Partial<Plotly.Config>;
  no_theme: boolean;
  no_default_layout: boolean;
  significant_changes_only: boolean;
  minimal_response: boolean;
};
export type EntityIdStateConfig = {
  entity: string;
};
export type EntityIdAttrConfig = {
  entity: string;
  attribute: string;
};
export type EntityIdStatisticsConfig = {
  entity: string;
  statistic: StatisticType;
  period: StatisticPeriod;
  autoPeriod: AutoPeriodConfig;
};
export type EntityIdConfig =
  | EntityIdStateConfig
  | EntityIdAttrConfig
  | EntityIdStatisticsConfig;

export function isEntityIdStateConfig(
  entityConfig: EntityIdConfig
): entityConfig is EntityIdStateConfig {
  return !(
    isEntityIdAttrConfig(entityConfig) ||
    isEntityIdStatisticsConfig(entityConfig)
  );
}
export function isEntityIdAttrConfig(
  entityConfig: EntityIdConfig
): entityConfig is EntityIdAttrConfig {
  return "attribute" in entityConfig;
}
export function isEntityIdStatisticsConfig(
  entityConfig: EntityIdConfig
): entityConfig is EntityIdStatisticsConfig {
  return "period" in entityConfig;
}

export type Timestamp = number;

export type CachedBaseEntity = {
  fake_boundary_datapoint?: true;
  x: Date;
  y: number | string | null;
};
export type CachedStateEntity = CachedBaseEntity & {
  raw_state: HassEntity;
};
export type CachedStatisticsEntity = CachedBaseEntity & {
  raw_statistics: StatisticValue;
};
export type CachedEntity = CachedStateEntity | CachedStatisticsEntity;

export type TimestampRange = Timestamp[]; // [Timestamp, Timestamp];

export type HATheme = {
  "--card-background-color": string;
  "--primary-background-color": string;
  "--primary-color": string;
  "--primary-text-color": string;
  "--secondary-text-color": string;
};
