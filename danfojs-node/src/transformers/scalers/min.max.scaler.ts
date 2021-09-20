/**
*  @license
* Copyright 2021, JsData. All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.

* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* ==========================================================================
*/

import { tensor1d, Tensor, tensor2d } from "@tensorflow/tfjs-node"
import Series from "../../core/series"
import DataFrame from "../../core/frame"
import Utils from "../../shared/utils"

const utils = new Utils()

/**
 * Transform features by scaling each feature to a given range.
 * This estimator scales and translates each feature individually such 
 * that it is in the given range on the training set, e.g. between the maximum and minimum value.
*/
export class MinMaxScaler {
    private $max: Tensor
    private $min: Tensor

    constructor() {
        this.$max = tensor1d([])
        this.$min = tensor1d([])
    }

    /**
     * Fits a MinMaxScaler to the data
     * @param data Array, Tensor, DataFrame or Series object
     */
    public fit(data: Array<number> | Tensor | DataFrame | Series) {
        let tensorArray;

        if (data instanceof Array) {
            if (utils.is1DArray(data)) {
                tensorArray = tensor1d(data)
            } else {
                tensorArray = tensor2d(data)
            }
        } else if (data instanceof DataFrame) {
            tensorArray = tensor2d(data.values as number[][])
        } else if (data instanceof Series) {
            tensorArray = tensor1d(data.values as number[])
        } else if (data instanceof Tensor) {
            tensorArray = data
        } else {
            throw new Error("ParamError: data must be one of Array, DataFrame or Series")
        }

        this.$max = tensorArray.max(0)
        this.$min = tensorArray.min(0)

        const outputData = tensorArray
            .sub(this.$min)
            .div(this.$max.sub(this.$min))

        if (Array.isArray(data)) {
            return outputData.arraySync()

        } else if (data instanceof Series) {
            return new Series(outputData, {
                index: data.index,
            });

        } else if (data instanceof Series) {
            return new DataFrame(outputData, {
                index: data.index,
                columns: data.columns,
                config: { ...data.config },
            });
        } else {
            return outputData
        }
    }

    /**
     * Transform the data using the fitted scaler
     * @param data Array, Tensor, DataFrame or Series object
     * @returns Array, Tensor, DataFrame or Series object
     * @example
     * const scaler = new MinMaxScaler()
     * scaler.fit([1, 2, 3, 4, 5])
     * scaler.transform([1, 2, 3, 4, 5])
     * // [0, 0.25, 0.5, 0.75, 1]
     * */
    public transform(data: Array<number> | Tensor | DataFrame | Series) {
        let tensorArray;

        if (data instanceof Array) {
            if (utils.is1DArray(data)) {
                tensorArray = tensor1d(data)
            } else {
                tensorArray = tensor2d(data)
            }
        } else if (data instanceof DataFrame) {
            tensorArray = tensor2d(data.values as number[][])
        } else if (data instanceof Series) {
            tensorArray = tensor1d(data.values as number[])
        } else if (data instanceof Tensor) {
            tensorArray = data
        } else {
            throw new Error("ParamError: data must be one of Array, DataFrame or Series")
        }

        const outputData = tensorArray
            .sub(this.$min)
            .div(this.$max.sub(this.$min))

        if (Array.isArray(data)) {
            return outputData.arraySync()

        } else if (data instanceof Series) {
            return new Series(outputData, {
                index: data.index,
            });

        } else if (data instanceof DataFrame) {
            return new DataFrame(outputData, {
                index: data.index,
                columns: data.columns,
                config: { ...data.config },
            });
        } else {
            return outputData
        }
    }
}


