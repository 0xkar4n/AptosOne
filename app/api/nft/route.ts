import { NextResponse } from "next/server"
import axios from "axios"

export async function GET() {
  try {
    const response = await axios.get(
      "https://aggregator-api.wapal.io/collection/popular?page=1&take=20&sortBy=ONE_D_VOLUME",
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    )

    // Return the data from the response
    return NextResponse.json({ data: response.data })
  } catch (error) {
    console.error("Error fetching NFT data:", error)

    // Detailed error handling
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status || 500
      const errorMessage = error.response?.data?.message || "Failed to fetch NFT data"

      return NextResponse.json({ error: errorMessage }, { status: statusCode })
    }

    return NextResponse.json({ error: "An unexpected error occurred while fetching NFT data" }, { status: 500 })
  }
}
