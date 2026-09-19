const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000/api";


let refreshPromise = null;


/* ==================================================
   REFRESH ACCESS TOKEN
================================================== */

async function refreshAccessToken() {
  const refreshToken =
    localStorage.getItem("refresh");

  if (!refreshToken) {
    return null;
  }


  // If a refresh is already happening,
  // reuse the same request.
  if (refreshPromise) {
    return refreshPromise;
  }


  refreshPromise = (async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/refresh/`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            refresh: refreshToken,
          }),
        }
      );


      if (!response.ok) {
        return null;
      }


      const data =
        await response.json();


      if (!data.access) {
        return null;
      }


      localStorage.setItem(
        "access",
        data.access
      );


      // Some JWT setups may also rotate refresh tokens
      if (data.refresh) {
        localStorage.setItem(
          "refresh",
          data.refresh
        );
      }


      return data.access;

    } catch (error) {
      console.error(
        "Token refresh failed:",
        error
      );

      return null;

    } finally {
      refreshPromise = null;
    }
  })();


  return refreshPromise;
}


/* ==================================================
   CLEAR AUTH
================================================== */

function clearAuth() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
}


/* ==================================================
   API FETCH
================================================== */

export async function apiFetch(
  endpoint,
  options = {}
) {
  let accessToken =
    localStorage.getItem("access");


  const makeRequest = async (
    token
  ) => {
    const headers = {
      ...(options.headers || {}),
    };


    if (token) {
      headers.Authorization =
        `Bearer ${token}`;
    }


    return fetch(
      `${API_BASE_URL}${endpoint}`,
      {
        ...options,
        headers,
      }
    );
  };


  /* ----------------------------------------------
     FIRST REQUEST
  ---------------------------------------------- */

  let response =
    await makeRequest(
      accessToken
    );


  /* ----------------------------------------------
     ACCESS TOKEN EXPIRED
  ---------------------------------------------- */

  if (
    response.status === 401
  ) {
    const newAccessToken =
      await refreshAccessToken();


    /* --------------------------------------------
       REFRESH TOKEN ALSO INVALID
    -------------------------------------------- */

    if (!newAccessToken) {
      clearAuth();

      window.location.replace(
        "/login"
      );

      return null;
    }


    /* --------------------------------------------
       RETRY ORIGINAL REQUEST
    -------------------------------------------- */

    response =
      await makeRequest(
        newAccessToken
      );


    /* --------------------------------------------
       STILL UNAUTHORIZED
    -------------------------------------------- */

    if (
      response.status === 401
    ) {
      clearAuth();

      window.location.replace(
        "/login"
      );

      return null;
    }
  }


  return response;
}


/* ==================================================
   LOGOUT
================================================== */

export function logoutUser() {
  clearAuth();

  window.location.replace(
    "/login"
  );
}


/* ==================================================
   LOGIN STATUS
================================================== */

export function isLoggedIn() {
  return Boolean(
    localStorage.getItem(
      "access"
    ) ||
    localStorage.getItem(
      "refresh"
    )
  );
}


export default apiFetch;