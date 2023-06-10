import { forIn } from 'lodash'
import mongoose from 'mongoose'
type FacetCategory = mongoose.PipelineStage.Facet['$facet'][string]
export const buildPaginationFacet = (page: number, pageSize: number): mongoose.PipelineStage.Facet['$facet'] => {
  return {
    meta: [
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
        },
      },
    ],
    data: [{ $sort: { createdAt: -1 } }, { $skip: page > 0 ? (page - 1) * pageSize : 0 }, { $limit: pageSize }],
  }
}

export const listSectionFacetCategory = (page: number, pageSize: number): FacetCategory => [
  { $sort: { createdAt: -1 } },
  { $skip: page > 0 ? (page - 1) * pageSize : 0 },
  { $limit: pageSize },
]

export const getListTotalFacetCategory = (): FacetCategory => [
  {
    $group: {
      _id: null,
      total: { $sum: 1 },
    },
  },
]

const toDocObjectOptionally = (doc: any) => {
  let _info: any = doc
  if (typeof _info?.toObject === 'function') {
    _info = _info.toObject()
  }
  return _info
}

export const removeSystemProperties = <T>(doc: T) => {
  const extractedVisibleInfo: any = {}
  forIn(toDocObjectOptionally(doc), (v, k) => {
    if (k !== '__v' && k !== '_id') {
      extractedVisibleInfo[k] = v
    }
  })
  return extractedVisibleInfo as T
}

export const removeSystemPropertiesFromData = <T>(data: any[]): T[] => {
  if (data?.length) {
    data = data.flatMap((item: any) => {
      return item ? [removeSystemProperties(item)] : []
    })
    return data
  }
  return []
}

export const and = (...params: any[]) => {
  const filteredParams = params.filter((param) => {
    if (param) return true
  })
  return { $and: filteredParams }
}
export const or = (...params: any[]) => {
  const filteredParams = params.filter((param) => {
    if (param) return true
  })
  return { $or: filteredParams }
}

export const upsertToArray = (element: any, arrayField: string) => {
  return {
    $cond: {
      if: { $gt: [{ $indexOfArray: ['$' + arrayField, element] }, -1] },
      then: '$' + arrayField,
      else: {
        $cond: {
          if: { $isArray: '$' + arrayField },
          then: { $concatArrays: ['$' + arrayField, [element]] },
          else: [element],
        },
      },
    },
  }
}
