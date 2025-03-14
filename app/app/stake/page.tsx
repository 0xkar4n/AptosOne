import StakingCards from '@/components/StakingCards'
import React from 'react'

const StakePage = () => {
  return (
    <main className="dark p-2">
      <h1 className="text-3xl font-bold text-white text-center mb-6 m-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-amber-400">
            Staking 
          </span>
        </h1>
      <StakingCards />
    </main>
  )
}

export default StakePage