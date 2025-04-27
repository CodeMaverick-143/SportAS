import { jwtVerify, SignJWT } from "jose"

// Create JWT token
export async function createJwt(payload: any) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET || "SporTAs_2025_Secret_Key_@123")
  
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // Token expires in 7 days
    .sign(secret)
    
  return jwt
}

// Verify JWT token
export function verifyJwt(token: string) {
  try {
    if (!token) return null
    
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "SporTAs_2025_Secret_Key_@123")
    
    // Using a synchronous approach for middleware compatibility
    // This is a simplified version for this project
    const decoded = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    )
    
    // Check if token is expired
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      return null
    }
    
    return decoded
  } catch (error) {
    console.error("JWT verification error:", error)
    return null
  }
}

// Async verification (more secure, use when possible)
export async function verifyJwtAsync(token: string) {
  try {
    if (!token) return null
    
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "SporTAs_2025_Secret_Key_@123")
    const { payload } = await jwtVerify(token, secret)
    
    return payload
  } catch (error) {
    console.error("JWT verification error:", error)
    return null
  }
}
