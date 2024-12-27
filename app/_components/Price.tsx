import { getCabinPrice } from '@/app/_lib/data-service'

type Props = {
  cabinId: number
}

async function Price({ cabinId }: Props) {
  const { regularPrice, discount } = await getCabinPrice(cabinId)

  return (
    <p className='mt-12 text-3xl flex gap-3 items-baseline'>
      {discount > 0 ? (
        <>
          <span className='text-3xl font-[350]'>
            ${regularPrice - discount}
          </span>
          <span className='line-through font-semibold text-primary-600'>
            ${regularPrice}
          </span>
        </>
      ) : (
        <span className='text-3xl font-[350]'>${regularPrice}</span>
      )}
      <span className='text-primary-200'>/ night</span>
    </p>
  )
}

export default Price
