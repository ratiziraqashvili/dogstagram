/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "img.clerk.com",
                pathname: "**",
            },
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
                pathname: "**",
            },
            {
                protocol: "https",
                hostname: "flagcdn.com",
                pathname: "**",
            },
            {
                protocol: "https",
                hostname: "upload.wikimedia.org",
                pathname: "**",
            }
        ]
    }
}

module.exports = nextConfig
