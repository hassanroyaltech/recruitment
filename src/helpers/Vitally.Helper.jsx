import { useEffect } from 'react';

const VitallyIntegration = () => {
  useEffect(() => {
    const vitallyScript = document.createElement('script');
    vitallyScript.src = 'https://cdn.vitally.io/vitally.js/v1/vitally.js';
    vitallyScript.defer = true;
    document.body.appendChild(vitallyScript);

    // Initialization script
    const initScript = document.createElement('script');
    initScript.type = 'text/javascript';
    initScript.text = `
  !(function (n, t, r) {
    for (
      var i = (n[t] = n[t] || []),
        o = function (r) {
          i[r] =
            i[r] ||
            function () {
              for (var n = [], t = 0; t < arguments.length; t++)
                n[t] = arguments[t];
              return i.push([r, n]);
            };
        },
        u = 0,
        c = ['init', 'user', 'account', 'track', 'nps'];
      u < c.length;
      u++
    ) {
      o(c[u]);
    }
  })(window, 'Vitally');
  Vitally.init(
    "${process.env.REACT_APP_VITALLY_KEY}",
    "${process.env.REACT_APP_VITALLY_URL}"
  ); 
`;
    document.body.appendChild(initScript);

    return () => {
      document.body.removeChild(vitallyScript);
      document.body.removeChild(initScript);
    };
  }, []);

  return null; // No direct rendering needed
};
export default VitallyIntegration;
