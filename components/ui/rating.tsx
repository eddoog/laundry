import React from 'react'
import MaterialRating from '@mui/material/Rating'
import { styled } from '@mui/material/styles'
import Box from "@mui/material/Box";
import { Label } from './label'

const labels: { [index: number]: string } = {
  1: 'Sangat Buruk',
  2: 'Buruk',
  3: 'Cukup Baik',
  4: 'Baik',
  5: 'Sangat Baik',
};

interface RatingProps {
  rating: number
  setRating: (value: number | null) => void
}

function getLabelText(rating: number) {
  return `${rating} Star${rating !== 1 ? "s" : ""}, ${labels[rating]}`;
}

const CustomRating = styled(MaterialRating)({
  '& .MuiRating-iconEmpty': {
    color: 'gray',
  }
})

export default function Rating({ rating, setRating }: RatingProps) {
  const [hover, setHover] = React.useState(-1);

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      style={{height: '100%'}}
    >
      <Label style={{ marginRight: '10px', alignSelf: 'center' }}>Rating</Label>
      <Box display="flex" alignItems="center" style={{ height: '100%' }}>
        <CustomRating
          name="hover-feedback"
          value={rating}
          precision={1}
          getLabelText={getLabelText}
          onChange={(event, newValue) => {
            setRating(newValue);
          }}
          onChangeActive={(event, newHover) => {
            setHover(newHover);
          }}
          
          style={{ marginRight: '10px' , marginBottom: '6px'}} 
        />
        {rating !== null && (
          <Label style={{ fontSize: '14px', marginLeft: '10px', alignSelf: 'center' }}>
            {labels[hover !== -1 ? hover : rating]}
          </Label>
        )}
      </Box>
    </Box>
  );
}