"use client";

import { FunctionComponent, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Iframe } from "@/components";
import { onAddWatchFilm } from "@/actions";

const Film: FunctionComponent = () => {
  const searchParams = useSearchParams();
  const knId = searchParams.get("knId");
  const iframeName = searchParams.get("iframeName");
  const params = knId ? {
    knId: Number(knId),
    iframeName: iframeName || undefined,
  } : null;

  useEffect(() => {
    if (knId) {
      onAddWatchFilm(Number(knId));
    }
  }, [knId]);

  return params ? (
    <Iframe
      key={params.knId}
      searchParamsIframeName={params.iframeName}
      knId={params.knId}
    />
  ) : null;
};

export default Film;
