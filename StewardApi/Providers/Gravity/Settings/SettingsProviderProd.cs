using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Forza.WebServices.FMG.Generated;
using Turn10.LiveOps.StewardApi.Contracts.Gravity.Settings;
using Turn10.Settings.Prod;

namespace Turn10.LiveOps.StewardApi.Providers.Gravity.Settings
{
    using Client =Turn10.LiveOps.StewardApi.Contracts.Gravity.Settings;
    using Franchise = Turn10.Settings.Prod.Contracts;

    /// <inheritdoc />
    public class SettingsProviderProd : ISettingsProvider
    {
        private static readonly HttpClient HttpClient = new HttpClient();

        /// <inheritdoc />
        public async Task<GameSettings> GetGameSettingAsync(Guid id)
        {
            var gsClient = new GameSettingsClient(HttpClient);
            var gameSettings = await gsClient.GetAsync(id);

            var carClient = new CarClient(HttpClient);
            var cars = (await carClient.GetListAsync(gameSettings.Cars)).Select(this.Convert);

            var currencyClient = new CurrencyClient(HttpClient);
            var currencies = (await currencyClient.GetListAsync(gameSettings.Currencies)).Select(this.Convert);

            var masteryKitClient = new MasteryKitClient(HttpClient);
            var masteryKits = (await masteryKitClient.GetListAsync(gameSettings.MasteryKits)).Select(this.Convert);

            var repairKitClient = new RepairKitClient(HttpClient);
            var repairKits = (await repairKitClient.GetListAsync(gameSettings.RepairKits)).Select(this.Convert);

            var upgradeKitClient = new UpgradeKitClient(HttpClient);
            var upgradeKits = (await upgradeKitClient.GetListAsync(gameSettings.UpgradeKits)).Select(this.Convert);

            var energyRefillClient = new EnergyRefillClient(HttpClient);
            var energyRefills = (await energyRefillClient.GetListAsync(gameSettings.EnergyRefills)).Select(this.Convert);

            IList<string> ftueStates;

            try
            {
                var ftueStateListClient = new FTUEStateListClient(HttpClient);
                var ftueStateList = await ftueStateListClient.GetAsync(gameSettings.FTUEStateList.Value);
                ftueStates = ftueStateList.Values.ToList();
            }
            catch
            {
                ftueStates = new List<string>();
            }

            var packDefinitionClient = new PackDefinitionClient(HttpClient);
            var packDefinitions = (await packDefinitionClient.GetListAsync(gameSettings.PackDefinitions)).Select(this.Convert);

            var heatClient = new HeatClient(HttpClient);
            var heats = (await heatClient.GetListAsync(gameSettings.Heats)).Select(this.Convert);

            return new GameSettings
            {
                Cars = cars.ToList(),
                Currencies = currencies.ToList(),
                EnergyRefills = energyRefills.ToList(),
                MasteryKits = masteryKits.ToList(),
                RepairKits = repairKits.ToList(),
                UpgradeKits = upgradeKits.ToList(),
                PackDefinitions = packDefinitions.ToList(),
                FtueStates = ftueStates,
                CarClasses = Enum.GetNames(typeof(Franchise.CarClass)),
                CareerNodeTypes = Enum.GetNames(typeof(Franchise.CareerNodeNodeType)),
                CareerRewardTypes = Enum.GetNames(typeof(Franchise.RewardType)),
                CarEras = Enum.GetNames(typeof(Franchise.CarEra)),
                CarGrades = Enum.GetNames(typeof(Franchise.CarGrade)),
                HeatEventTypes = Enum.GetNames(typeof(Franchise.HeatEventType)),
                SubscriptionTiers = Enum.GetNames(typeof(LiveOpsSubscriptionTier)),
                UpgradeRequirementItemTypes = Enum.GetNames(typeof(Franchise.UpgradeRequirementItemType)),
                UpgradeTiers = Enum.GetNames(typeof(Franchise.UpgradeKitUpgradeTier)),
                HeatDetails = heats.ToList()
            };
        }

        private GameDataItem<int> Convert(Franchise.PackDefinition packDefinition)
        {
            return new GameDataItem<int>
            {
                Details = 0,
                CreatedBy = packDefinition.CreatedBy,
                Created = packDefinition.Created.Value,
                ItemId = packDefinition.PackId.Value,
                LastUpdatedBy = packDefinition.LastUpdatedBy,
                LastUpdated = packDefinition.LastUpdated.Value,
                Name = packDefinition.PackName,
                SettingsId = packDefinition.Id.Value
            };
        }

        private GameDataItem<EnergyRefillDetails> Convert(Franchise.EnergyRefill energyRefill)
        {
            return new GameDataItem<EnergyRefillDetails>
            {
                Details = new EnergyRefillDetails
                {
                    IsFull = energyRefill.IsFull.Value,
                    PartialValue = energyRefill.PartialValue.Value
                },
                CreatedBy = energyRefill.CreatedBy,
                ItemId = energyRefill.RefillId.Value,
                LastUpdatedBy = energyRefill.LastUpdatedBy,
                Name = energyRefill.IsFull.Value ? $"Full Energy Refill" : $"{energyRefill.PartialValue.Value} Point Energy Refill",
                SettingsId = energyRefill.Id.Value
            };
        }

        private GameDataItem<UpgradeKitDetails> Convert(Franchise.UpgradeKit upgradeKit)
        {
            return new GameDataItem<UpgradeKitDetails>
            {
                Details = new UpgradeKitDetails
                {
                    CarClass = upgradeKit.CarClass.Value.ToString("g"),
                    UpgradeTier = upgradeKit.UpgradeTier.Value.ToString("g")
                },
                CreatedBy = upgradeKit.CreatedBy,
                ItemId = upgradeKit.KitId.Value,
                LastUpdatedBy = upgradeKit.LastUpdatedBy,
                Name = $"{upgradeKit.UpgradeTier:G} {upgradeKit.CarClass:G} Upgrade Kit",
                SettingsId = upgradeKit.Id.Value
            };
        }

        private GameDataItem<RepairKitDetails> Convert(Franchise.RepairKit repairKit)
        {
            return new GameDataItem<RepairKitDetails>
            {
                Details = new RepairKitDetails
                {
                    RepairValue = repairKit.RepairValue.Value,
                    StarRatingRequirement = repairKit.StarRatingRequirement.Value
                },
                CreatedBy = repairKit.CreatedBy,
                ItemId = repairKit.KitId.Value,
                LastUpdatedBy = repairKit.LastUpdatedBy,
                Name = $"{repairKit.StarRatingRequirement.Value} Star Repair Kit",
                SettingsId = repairKit.Id.Value
            };
        }

        private GameDataItem<int> Convert(Franchise.Currency currency)
        {
            return new GameDataItem<int>
            {
                Details = -1,
                CreatedBy = currency.CreatedBy,
                Description = currency.Description,
                ImageUrl = currency.ImageUri,
                ItemId = currency.CurrencyId.Value,
                LastUpdatedBy = currency.LastUpdatedBy,
                Name = currency.Name,
                SettingsId = currency.Id.Value
            };
        }

        private GameDataItem<MasteryKitDetails> Convert(Franchise.MasteryKit masteryKit)
        {
            return new GameDataItem<MasteryKitDetails>
            {
                Details = new MasteryKitDetails
                {
                    CarClass = masteryKit.CarClass.Value.ToString("g"),
                    ClassBonusValue = masteryKit.ClassBonusValue.Value,
                    CurrencyModifier = masteryKit.CurrencyModifier.Value,
                    CurrencyId = masteryKit.CurrencyType.Value,
                    Value = masteryKit.Value.Value
                },
                CreatedBy = masteryKit.CreatedBy,
                ItemId = masteryKit.KitId.Value,
                LastUpdatedBy = masteryKit.LastUpdatedBy,
                Name = $"{masteryKit.CarClass:G} {masteryKit.Value.Value} Mastery Kit"
            };
        }

        private GameDataItem<CarDetails> Convert(Franchise.Car car)
        {
            return new GameDataItem<CarDetails>
            {
                Details = new CarDetails
                {
                    CarClass = car.CarClass.Value.ToString("g"),
                    CarId = car.CarId.Value,
                    CarName = car.CarName,
                    CountryId = car.CountryId.Value,
                    DuplicateRewardsPackage = car.DuplicateRewardsPackage.Value,
                    Era = car.Era.Value.ToString("g"),
                    Grade = car.Grade.Value.ToString("g"),
                    ManufacturerId = car.ManufacturerId.Value,
                    MaxConditionPips = car.MaxConditionPips.Value,
                    MaxPerformanceIndex = car.MaxPerformanceIndex.Value,
                    MinPerformanceIndex = car.MinPerformanceIndex.Value,
                    ModelId = car.ModelId.Value,
                    ReleaseYear = car.ReleaseYear.Value,
                    TransitionCarId = car.TransitionCarId.Value,
                    StarRanks = car.StarRanks.Select(this.Convert).ToList(),
                    StarRating = car.StarRating.Value
                },

                CreatedBy = car.CreatedBy,
                ItemId = car.CarId.Value,
                LastUpdatedBy = car.LastUpdatedBy,
                Name = $"{car.StarRating} Star {car.CarName}",
                SettingsId = car.Id.Value
            };
        }

        private Client.StarRank Convert(Franchise.StarRank starRank)
        {
            return new Client.StarRank
            {
                Id = starRank.Id.Value,
                MasteryLevelSpacingCoefficients = starRank.MasteryLevelSpacingCoefficients.ToList(),
                MaxLevel = starRank.MaxLevel.Value,
                PILowerThresholdProportion = starRank.PILowerThresholdProportion.Value,
                PIUpperThresholdProportion = starRank.PIUpperThresholdProportion.Value,
                Rank = starRank.Rank.Value,
                RequiredUpgrades = starRank.RequiredUpgrades.Select(this.Convert).ToList(),
                TotalMasteryThreshold = starRank.TotalMasteryThreshold.Value
            };
        }

        private Client.UpgradeRequirement Convert(Franchise.UpgradeRequirement upgradeRequirement)
        {
            return new Client.UpgradeRequirement
            {
                CreatedBy = upgradeRequirement.CreatedBy,
                ItemId = upgradeRequirement.ItemId.Value,
                Id = upgradeRequirement.Id.Value,
                LastUpdatedBy = upgradeRequirement.LastUpdatedBy,
                ItemQuantity = upgradeRequirement.ItemQuantity.Value,
                ItemType = upgradeRequirement.ItemType.Value.ToString("g")
            };
        }

        private GameDataItem<HeatDetails> Convert(Franchise.Heat heat)
        {
            return new GameDataItem<HeatDetails>
            {
                Details = new HeatDetails
                {
                    AlwaysUnlocked = heat.AlwaysUnlocked.Value,
                    DefaultEnergyCost = heat.DefaultEnergyCost.Value,
                    EventType = heat.EventType.Value.ToString("G"),
                    HeatId = heat.HeatId.Value,
                    Id = heat.Id.Value
                },
                Created = heat.Created.Value,
                CreatedBy = heat.CreatedBy,
                LastUpdated = heat.LastUpdated.Value,
                LastUpdatedBy = heat.LastUpdatedBy,
                Description = $"{heat.EventType.Value:G} Heat {heat.HeatId.Value}",
                ItemId = heat.HeatId.Value,
                Name = $"{heat.EventType.Value:G} Heat {heat.HeatId.Value}",
                SettingsId = heat.Id.Value
            };
        }

        private HeatNode Convert(Franchise.HeatNode heatNode)
        {
            return new HeatNode
            {
                Id = heatNode.Id.Value,
                Destinations = heatNode.Destinations.ToList(),
                EnergyCost = heatNode.EnergyCost.Value,
                Type = heatNode.Type.Value.ToString("G")
            };
        }
    }
}
