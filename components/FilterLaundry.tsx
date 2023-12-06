import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Tags } from '@/lib/enum'
import React, { useState } from 'react'

export const FilterLaundry = (props: any) => {
  const laundryTagsArray = Object.values(Tags)
  const [keyword, setKeyword] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value)
  }

  const handleCheckboxClick = (tag: string) => {
    setSelectedTags((prevTags) => {
      if (prevTags.includes(tag)) {
        return prevTags.filter((t) => t !== tag)
      } else {
        return [...prevTags, tag]
      }
    })
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    const selectedTagsString = selectedTags.join(',')
    props.onSubmit(e, keyword, selectedTagsString)
  }

  return (
    <form
      className="flex flex-col w-full max-w-sm items-center space-y-2"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col w-full max-w-sm items-center space-y-2">
        <div className="w-full h-fit flex flex-row items-center space-x-2">
          <Input
            type="keyword"
            placeholder="masukkan nama laundry"
            value={keyword}
            onChange={handleKeywordChange}
          />
          <Button type="submit">Search</Button>
        </div>
        <div className="flex items-center space-x-2">
          {laundryTagsArray.map((tag, index) => (
            <React.Fragment key={index}>
              <Checkbox
                id={`tagCheckbox${index}`}
                onClick={() => handleCheckboxClick(tag)}
              />
              <label
                htmlFor={`tagCheckbox${index}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {tag}
              </label>
            </React.Fragment>
          ))}
        </div>
      </div>
    </form>
  )
}
