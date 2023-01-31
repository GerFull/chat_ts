import style from '../input/input.module.scss'

interface Props {
   value: string
   onChange: (value: string) => void
}

function Input(props: Props) {
   const { value, onChange } = props

   return (

      <input
      type='text'
         className={style.input}
         value={value}
         onChange={(e) => onChange(e.target.value)}
      />


   )
}

export default Input
