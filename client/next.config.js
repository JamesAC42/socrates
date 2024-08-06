module.exports = {
    async rewrites() {
        return [
            {
                source: '/socrates/api/:path*',
                destination: 'http://localhost:5000/:path*'
            }
        ];
    },
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'Referrer-Policy',
              value: 'strict-origin-when-cross-origin',
            },
          ],
        },
      ];
    },
};