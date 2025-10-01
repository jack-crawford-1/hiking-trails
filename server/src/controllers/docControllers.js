import dotenv from "dotenv";
dotenv.config();

import redisClient from "../db/redisClient.js";

const xApiKey = process.env.DOC_API_KEY;

// HUTS

export async function getAllHuts(req, res, next) {
  const url = "https://api.doc.govt.nz/v2/huts";
  try {
    const response = await fetch(url, {
      headers: {
        "x-api-key": xApiKey,
        accept: "application/json",
      },
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function getHutDetailsByID(req, res, next) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Missing hut ID." });
  }

  const url = `https://api.doc.govt.nz/v2/huts/${id}/detail`;

  try {
    const response = await fetch(url, {
      headers: {
        "x-api-key": xApiKey,
        accept: "application/json",
      },
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function getAllHutAlerts(req, res, next) {
  const url = "https://api.doc.govt.nz/v2/huts/alerts";
  try {
    const response = await fetch(url, {
      headers: {
        "x-api-key": xApiKey,
        accept: "application/json",
      },
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function getHutAlertById(req, res, next) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Missing hut ID" });
  }

  const url = `https://api.doc.govt.nz/v2/huts/${id}/alerts`;

  try {
    const response = await fetch(url, {
      headers: {
        "x-api-key": xApiKey,
        accept: "application/json",
      },
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    next(err);
  }
}

// TRACKS

export async function getAllTracks(req, res, next) {
  const url = "https://api.doc.govt.nz/v1/tracks";
  try {
    const cacheKey = "doc_all_tracks";
    const cached = await redisClient.get(cacheKey);

    if (cached) {
      return res.json(JSON.parse(cached));
    }
    const response = await fetch(url, {
      headers: {
        "x-api-key": xApiKey,
        accept: "application/json",
      },
    });
    const data = await response.json();
    await redisClient.set(cacheKey, JSON.stringify(data), {
      EX: 60 * 60 * 6,
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function getTrackDetailsById(req, res, next) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Missing track ID." });
  }

  const url = `https://api.doc.govt.nz/v1/tracks/${id}/detail`;

  try {
    const response = await fetch(url, {
      headers: {
        "x-api-key": xApiKey,
        accept: "application/json",
      },
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function getAllTracksInRegion(req, res, next) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Missing track ID." });
  }

  const url = `https://api.doc.govt.nz/v1/tracks/region/${id}`;

  try {
    const response = await fetch(url, {
      headers: {
        "x-api-key": xApiKey,
        accept: "application/json",
      },
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function getAllTrackAlerts(req, res, next) {
  const url = "https://api.doc.govt.nz/v1/tracks/alerts";
  try {
    const response = await fetch(url, {
      headers: {
        "x-api-key": xApiKey,
        accept: "application/json",
      },
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function getTrackAlertById(req, res, next) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Missing track ID." });
  }

  const url = `https://api.doc.govt.nz/v1/tracks/${id}/alerts`;

  try {
    const response = await fetch(url, {
      headers: {
        "x-api-key": xApiKey,
        accept: "application/json",
      },
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    next(err);
  }
}
