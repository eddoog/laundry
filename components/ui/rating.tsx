import React from 'react'
import MaterialRating from '@mui/material/Rating'
import { styled } from '@mui/material/styles'

interface RatingProps {
  rating: number
  setRating: (value: number | null) => void
}

const CustomRating = styled(MaterialRating)({
  '& .MuiRating-iconEmpty': {
    color: 'gray',
  },
  '& .MuiRating-iconHover': {
    color: 'gold',
  },
  '& .MuiRating-iconFilled': {
    color: 'gold',
  },
})

const Rating: React.FC<RatingProps> = ({ rating, setRating }) => (
  <CustomRating
    name="penilaian-rating"
    value={rating}
    onChange={(event, newValue) => {
      setRating(newValue)
    }}
    style={{ marginLeft: 'auto' }}
  />
)

export default Rating
