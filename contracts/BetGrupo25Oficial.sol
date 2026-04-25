// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";
import {VRFConsumerBaseV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";

contract BetGrupo25Oficial is VRFConsumerBaseV2Plus {
    uint256 public s_subscriptionId;
    bytes32 public keyHash;
    uint32 public callbackGasLimit = 2500000;
    uint16 public requestConfirmations = 3;

    struct Resultado {
        uint256 milhar;
        uint8 grupoX;
        uint8 grupoY;
        string prognostico;
    }

    struct Rodada {
        uint256 id;
        uint256 arrecadacaoTotal;
        uint256 premioBrutoPool;
        bool sorteioConcluido;
        bool processada;
        Resultado[5] resultados;
        uint256 seguridadeSocial;
        uint256 fnsp;
        uint256 fnde;
        uint256 custeioOperador;
        uint256 outrosEncargos;
        mapping(uint8 => uint256) faixasPremiacao;
        mapping(uint8 => uint256) ganhadoresPorFaixa;
    }

    uint256 public rodadaAtual;
    uint256 public acumuladoProximaRodada;
    mapping(uint256 => Rodada) public historico;
    mapping(uint256 => uint256) public requestToRodada;

    event SorteioIniciado(uint256 indexed rodadaId, uint256 requestId);
    event SorteioFinalizado(uint256 indexed rodadaId, Resultado[5] resultados);
    event RodadaEncerrada(uint256 indexed rodadaId, uint256 totalGanhadores, uint256 novoAcumulado);

    constructor(uint256 _subId, address _vrfCoordinator, bytes32 _keyHash) 
        VRFConsumerBaseV2Plus(_vrfCoordinator) 
    {
        s_subscriptionId = _subId;
        keyHash = _keyHash;
    }

    function realizarSorteioOficial(uint256 _arrecadacao) external onlyOwner returns (uint256 requestId) {
        require(_arrecadacao > 0, "Arrecadacao zerada");
        rodadaAtual++;
        requestId = s_vrfCoordinator.requestRandomWords(
            VRFV2PlusClient.RandomWordsRequest({
                keyHash: keyHash,
                subId: s_subscriptionId,
                requestConfirmations: requestConfirmations,
                callbackGasLimit: callbackGasLimit,
                numWords: 5,
                extraArgs: VRFV2PlusClient._argsToBytes(VRFV2PlusClient.ExtraArgsV1({nativePayment: false}))
            })
        );
        Rodada storage r = historico[rodadaAtual];
        r.id = rodadaAtual;
        r.arrecadacaoTotal = _arrecadacao;
        requestToRodada[requestId] = rodadaAtual;
        emit SorteioIniciado(rodadaAtual, requestId);
    }

    function fulfillRandomWords(uint256 _requestId, uint256[] calldata _randomWords) internal override {
        uint256 id = requestToRodada[_requestId];
        Rodada storage r = historico[id];
        for (uint8 i = 0; i < 5; i++) {
            uint256 milhar = _randomWords[i] % 10000;
            uint8 d1 = uint8(milhar / 100); 
            uint8 d2 = uint8(milhar % 100);
            uint8 val1 = (d1 == 0) ? 100 : d1;
            uint8 val2 = (d2 == 0) ? 100 : d2;
            uint8 g1 = uint8(((val1 - 1) / 4) + 1);
            uint8 g2 = uint8(((val2 - 1) / 4) + 1);
            r.resultados[i] = Resultado({
                milhar: milhar,
                grupoX: g1,
                grupoY: g2,
                prognostico: string(abi.encodePacked(uint2str(g1), "/", uint2str(g2)))
            });
        }
        uint256 a = r.arrecadacaoTotal;
        r.premioBrutoPool = (a * 4335) / 10000;
        r.seguridadeSocial = (a * 1732) / 10000;
        r.fnsp = (a * 926) / 10000;
        r.fnde = (a * 926) / 10000;
        r.custeioOperador = (a * 957) / 10000;
        r.outrosEncargos = a - (r.premioBrutoPool + r.seguridadeSocial + r.fnsp + r.fnde + r.custeioOperador);
        uint256 poolDisponivel = r.premioBrutoPool + acumuladoProximaRodada;
        acumuladoProximaRodada = 0;
        r.faixasPremiacao[5] = (poolDisponivel * 50) / 100;
        r.faixasPremiacao[4] = (poolDisponivel * 20) / 100;
        r.faixasPremiacao[3] = (poolDisponivel * 15) / 100;
        r.faixasPremiacao[2] = (poolDisponivel * 10) / 100;
        r.faixasPremiacao[1] = (poolDisponivel * 5) / 100;
        r.sorteioConcluido = true;
        emit SorteioFinalizado(id, r.resultados);
    }

    function encerrarRodada(uint256 _id, uint256[6] calldata _ganhadores) external onlyOwner {
        Rodada storage r = historico[_id];
        require(r.sorteioConcluido && !r.processada, "Estado invalido");
        if (_ganhadores[5] == 0) {
            uint256 v5 = r.faixasPremiacao[5];
            r.faixasPremiacao[5] = 0;
            r.faixasPremiacao[4] += (v5 * 40) / 100;
            r.faixasPremiacao[3] += (v5 * 30) / 100;
            r.faixasPremiacao[2] += (v5 * 20) / 100;
            r.faixasPremiacao[1] += (v5 * 10) / 100;
        }
        bool existeGanhador = false;
        uint256 totalGanhadores = 0;
        for(uint8 i = 1; i <= 5; i++) {
            if(_ganhadores[i] > 0) {
                r.ganhadoresPorFaixa[i] = _ganhadores[i];
                existeGanhador = true;
                totalGanhadores += _ganhadores[i];
            }
        }
        if (!existeGanhador) {
            acumuladoProximaRodada += (r.faixasPremiacao[5] + r.faixasPremiacao[4] + r.faixasPremiacao[3] + r.faixasPremiacao[2] + r.faixasPremiacao[1]);
            for(uint8 i = 1; i <= 5; i++) r.faixasPremiacao[i] = 0;
        }
        r.processada = true;
        emit RodadaEncerrada(_id, totalGanhadores, acumuladoProximaRodada);
    }

    function uint2str(uint256 _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) return "0";
        uint256 j = _i;
        uint256 len;
        while (j != 0) { len++; j /= 10; }
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        while (_i != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(_i - (_i / 10) * 10));
            bstr[k] = bytes1(temp);
            _i /= 10;
        }
        return string(bstr);
    }
}